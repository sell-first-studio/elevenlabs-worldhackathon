import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    # Twilio
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_sms_phone: str
    twilio_voice_phone: str

    # LiveKit
    livekit_url: str
    livekit_api_key: str
    livekit_api_secret: str
    sip_trunk_id: str

    # ElevenLabs
    eleven_api_key: str

    # Blackbox
    blackbox_api_key: str

    # OpenAI
    openai_api_key: str


def load_config() -> Config:
    return Config(
        twilio_account_sid=os.environ["TWILIO_ACCOUNT_SID"],
        twilio_auth_token=os.environ["TWILIO_AUTH_TOKEN"],
        twilio_sms_phone=os.environ["TWILIO_SMS_PHONE_NUMBER"],
        twilio_voice_phone=os.environ["TWILIO_VOICE_PHONE_NUMBER"],
        livekit_url=os.environ["LIVEKIT_URL"],
        livekit_api_key=os.environ["LIVEKIT_API_KEY"],
        livekit_api_secret=os.environ["LIVEKIT_API_SECRET"],
        sip_trunk_id=os.environ["SIP_TRUNK_ID"],
        eleven_api_key=os.environ["ELEVEN_API_KEY"],
        blackbox_api_key=os.environ["BLACKBOX_API_KEY"],
        openai_api_key=os.environ["OPENAI_API_KEY"],
    )
