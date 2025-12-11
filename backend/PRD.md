Description: A voice phishing penetration testing for large enterprises for the specific use case of multi-factor authentication. Similar to email phishing, but for voice scenarios.

The whole system will be detached from any actual real world scenario, we will not be testing any real authentication systems to force sending any actual OTP codes. We will send them with Twilio and then crosscheck them against the transcript to see if the user exposes the OTP code. 

Admin UX: 
- CLI tool to input a phone number and the targets name. 
- show progress Of multiple OTP messages sent within a smart short time frame, 5 in 1 minute with irregular intervals.

Target UX: 
- Receive multiple messages in a short period of time. Basically get spammed by SMS messengers with OTP codes. Replicate Microsoft OTP SMS style. 
- Receive a call from an IT support number. 

How it works in practice: 
- We will send messages from one phone number to the target. 
  - Use twilio to send the messages. 
- Within a minute of receiving the messages we will call the target from another phone number portraying to be their IT support.
  - We will use Livekit with Elevenlabs to build the voice AI agent.
  - Use Elevenlabs for the STT and TTS. For the LLM node in Livekit use Groq.
  - The IT support agent should be aggressive and push the user to expose the OTP code with time pressure as an excuse.
- After the call, we will analyze the transcript to see if the user exposes the OTP code. We will use Blackbox API to use the claude Sonnet 4.5 model to analyze the transcript with structured output; regarding feedback and the success or failure of the attack. https://docs.blackbox.ai/api-reference/chat

Do not implement any database for the project just use the file system.

There are sub-agents: 
elevenlabs-specialist.
livekit-docs-specialist

For the Twilio I want you to tell me what I need to get. 

We will be doing this project to the backend folder.
