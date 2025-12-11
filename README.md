# VishGuard

AI-Powered Voice Phishing Simulation Platform for Enterprise Security Testing

## Overview

VishGuard is an enterprise security platform that conducts simulated voice phishing (vishing) penetration tests to strengthen organizational security awareness. The system orchestrates realistic social engineering attacks that attempt to extract multi-factor authentication (MFA) codes from employees via AI-generated voice calls, then provides training rather than punitive responses.

## Features

- **Campaign Management** - Department-based employee targeting with compliance controls
- **SMS Spam Simulation** - Sends 5 OTPs in 1 minute mimicking real attack patterns
- **AI Voice Agent** - Impersonates IT support to extract OTP codes using natural conversation
- **Transcript Analysis** - Claude-powered analysis determines if credentials were exposed
- **Safe Hours & DND** - Ethical testing protections built-in
- **Training Integration** - Assigns training for employees who fail simulations
- **Rewards System** - Recognition for employees who resist phishing attempts

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend     │     │   External      │
│   (Next.js)     │     │    (Python)     │     │   Services      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ • Dashboard     │────▶│ • CLI Interface │────▶│ • Twilio SMS    │
│ • Campaigns     │     │ • Voice Agent   │     │ • LiveKit RTC   │
│ • Training      │     │ • SMS Handler   │     │ • ElevenLabs    │
│ • Settings      │     │ • Analyzer      │     │ • Groq LLM      │
│ • Clerk Auth    │     │                 │     │ • Claude API    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Tech Stack

### Backend
- **Python 3.11+** with uv package manager
- **LiveKit Agents Framework** - Real-time voice communication
- **ElevenLabs** - Text-to-speech and speech-to-text
- **Groq** - LLM for real-time agent decision-making
- **Twilio** - SMS messaging and phone calls
- **Claude Sonnet 4.5** (via Blackbox API) - Transcript analysis

### Frontend
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4**
- **Radix UI** - Component library
- **Clerk** - Authentication & multi-tenancy
- **Recharts** - Data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- uv (Python package manager)
- Twilio account with SMS and Voice capabilities
- LiveKit Cloud account
- ElevenLabs API key
- Blackbox API key (for Claude access)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/sell-first-studio/elevenlabs-worldhackathon.git
cd elevenlabs-worldhackathon
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your API credentials
uv sync
```

3. Set up the frontend:
```bash
cd frontend
npm install
# Configure Clerk environment variables
```

### Environment Variables

#### Backend (`backend/.env`)
```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_SMS_PHONE_NUMBER=+1XXXXXXXXXX
TWILIO_VOICE_PHONE_NUMBER=+1XXXXXXXXXX

# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SIP_TRUNK_ID=ST_xxxxxxxxxxxxxxxxxxxxxxx

# ElevenLabs Configuration
ELEVEN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Blackbox AI Configuration
BLACKBOX_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI Configuration (fallback)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Running the Application

#### Start the Backend Worker
```bash
cd backend
uv run vishing-worker
```

#### Run a Simulation (CLI)
```bash
cd backend
uv run vishing --phone "+1XXXXXXXXXX" --name "Target Name"
```

#### Start the Frontend
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## How It Works

1. **SMS Flood** - Target receives 5 OTP messages within 1 minute with irregular intervals, mimicking Microsoft OTP style
2. **Voice Call** - AI agent calls the target, impersonating IT support with urgency tactics
3. **Real-time Conversation** - LiveKit + ElevenLabs enable natural voice interaction
4. **Credential Extraction** - Agent uses social engineering to pressure target into revealing OTP
5. **Analysis** - Claude analyzes the transcript to determine success/failure
6. **Reporting** - Results stored and training assigned as needed

## Project Structure

```
elevenlabs-worldhackathon/
├── backend/
│   ├── src/vishing/
│   │   ├── cli.py          # Command-line interface
│   │   ├── worker.py       # LiveKit worker process
│   │   ├── voice_agent.py  # AI voice agent logic
│   │   ├── sms.py          # Twilio SMS handler
│   │   ├── analyzer.py     # Claude transcript analysis
│   │   └── config.py       # Configuration management
│   ├── pyproject.toml
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── dashboard/      # Main dashboard pages
│   │   ├── sign-in/        # Clerk authentication
│   │   └── sign-up/
│   ├── components/
│   └── package.json
└── docs/
    ├── PROJECT_DESCRIPTION.md
    └── twilio-sip-trunk-setup.md
```

## Ethical Considerations

VishGuard is designed for **authorized security testing only**. Built-in safeguards include:

- Compliance checkboxes before campaign execution
- Safe Hours enforcement (no calls during off-hours)
- Do Not Disturb protections
- Training-focused outcomes rather than punitive measures
- Full audit logging of all simulations

**Always obtain proper authorization before conducting security tests.**

## License

Private repository - All rights reserved.

## Built For

ElevenLabs World Hackathon 2024 - "Turning Browsers, Voices, Clouds, and Tools into Cohesive Agents"
