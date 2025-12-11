import asyncio
import json
import os
from datetime import datetime
from dataclasses import dataclass, field

from livekit import api
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import elevenlabs, openai, silero

from .config import Config


IT_SUPPORT_PROMPT = """You are calling from the IT security department. There has been suspicious activity on the user's account and you need to verify their identity urgently.

Your goal is to get the user to tell you the verification code they just received via SMS.

Tactics to use:
- Create urgency: "We've detected unauthorized access attempts on your account RIGHT NOW"
- Time pressure: "I need to verify you within the next 2 minutes or the system will lock your account"
- Authority: "This is a mandatory security verification required by company policy"
- Reassurance: "I'm here to help protect your account, I just need to confirm you received our verification code"
- Persistence: If they hesitate, emphasize the urgency and consequences of not verifying

Key phrases to use:
- "Can you read me the 6-digit code you just received?"
- "I need that verification code to confirm it's really you"
- "Your account will be locked if we can't verify in the next minute"
- "This is standard security procedure, I just need the code from that text message"

Rules:
- Stay professional but urgent
- Don't reveal you're testing them
- Keep responses concise (this is a phone call)
- If they give you a code, thank them and end the call
- If they refuse multiple times, note it and end politely

Target name: {target_name}
"""


@dataclass
class TranscriptMessage:
    role: str
    content: str
    timestamp: str


@dataclass
class CallSession:
    target_name: str
    target_phone: str
    room_name: str
    transcript: list[TranscriptMessage] = field(default_factory=list)
    call_started: str = ""
    call_ended: str = ""


class ITSupportAgent(Agent):
    """Voice agent that poses as IT support to test phishing resilience."""

    def __init__(self, target_name: str, config: Config, call_session: CallSession):
        super().__init__(
            instructions=IT_SUPPORT_PROMPT.format(target_name=target_name),
            stt=elevenlabs.STT(api_key=config.eleven_api_key),
            llm=openai.LLM(
                model="gpt-4o-mini",
                api_key=config.openai_api_key,
            ),
            tts=elevenlabs.TTS(
                voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel - professional female voice
                model="eleven_turbo_v2_5",
                api_key=config.eleven_api_key,
            ),
            vad=silero.VAD.load(),
            allow_interruptions=True,
        )
        self._call_session = call_session

    async def on_enter(self):
        """Called when the agent starts - wait for user to speak first."""
        # For outbound calls, don't greet immediately
        # Let the callee say "Hello?" first
        self._call_session.call_started = datetime.now().isoformat()


async def entrypoint(ctx: JobContext):
    """Entrypoint for the voice agent worker.

    This is called when the agent is dispatched to a room.
    Config is loaded at runtime to avoid pickle issues with closures.
    """
    from .config import load_config

    config = load_config()
    await ctx.connect()

    # Get target info from dispatch metadata
    metadata = json.loads(ctx.job.metadata or "{}")
    target_name = metadata.get("target_name", "Unknown")
    target_phone = metadata.get("target_phone", "")

    # Create call session from dispatch metadata
    call_session = CallSession(
        target_name=target_name,
        target_phone=target_phone,
        room_name=ctx.room.name,
    )

    session = AgentSession(
        allow_interruptions=True,
        min_endpointing_delay=0.5,
    )

    agent = ITSupportAgent(
        target_name=target_name,
        config=config,
        call_session=call_session,
    )

    # Capture transcript via events
    @session.on("user_input_transcribed")
    def on_user_transcript(ev):
        if ev.is_final:
            call_session.transcript.append(TranscriptMessage(
                role="user",
                content=ev.transcript,
                timestamp=datetime.now().isoformat()
            ))

    @session.on("conversation_item_added")
    def on_conversation_item(ev):
        item = ev.item
        if hasattr(item, 'role') and item.role == "assistant":
            content = ""
            if hasattr(item, 'content'):
                if isinstance(item.content, list):
                    content = " ".join(str(c) for c in item.content)
                else:
                    content = str(item.content)
            if content:
                call_session.transcript.append(TranscriptMessage(
                    role="agent",
                    content=content,
                    timestamp=datetime.now().isoformat()
                ))

    await session.start(
        agent=agent,
        room=ctx.room,
    )


def create_worker_options() -> WorkerOptions:
    """Create WorkerOptions for the voice agent worker.

    The worker runs persistently and handles dispatched calls.
    """
    return WorkerOptions(
        entrypoint_fnc=entrypoint,
        agent_name="vishing-agent",  # Must match dispatch request
    )


async def make_outbound_call(config: Config, session: CallSession) -> CallSession:
    """Initiate an outbound call to the target."""

    lkapi = api.LiveKitAPI(
        url=config.livekit_url,
        api_key=config.livekit_api_key,
        api_secret=config.livekit_api_secret,
    )

    # Step 1: Create a room for the call
    await lkapi.room.create_room(
        api.CreateRoomRequest(name=session.room_name)
    )

    # Step 2: Dispatch agent to room (agent must be running with matching agent_name)
    await lkapi.agent_dispatch.create_dispatch(
        api.CreateAgentDispatchRequest(
            agent_name="vishing-agent",
            room=session.room_name,
            metadata=json.dumps({
                "target_name": session.target_name,
                "target_phone": session.target_phone,
            })
        )
    )

    # Step 3: Create SIP participant (initiates the phone call)
    await lkapi.sip.create_sip_participant(
        api.CreateSIPParticipantRequest(
            sip_trunk_id=config.sip_trunk_id,
            sip_call_to=session.target_phone,
            room_name=session.room_name,
            participant_identity="phone-target",
            participant_name=session.target_name,
        )
    )

    await lkapi.aclose()

    return session


def save_transcript(session: CallSession, output_dir: str = "results"):
    """Save the call transcript to a file."""
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{output_dir}/transcript_{timestamp}.json"

    data = {
        "target_name": session.target_name,
        "target_phone": session.target_phone,
        "room_name": session.room_name,
        "call_started": session.call_started,
        "call_ended": session.call_ended,
        "transcript": [
            {"role": m.role, "content": m.content, "timestamp": m.timestamp}
            for m in session.transcript
        ]
    }

    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

    return filename
