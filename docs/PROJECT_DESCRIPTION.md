# VishGuard: AI-Powered Voice Phishing Simulation Platform

## Core Functionality

VishGuard is an enterprise security platform that conducts simulated voice phishing (vishing) penetration tests to strengthen organizational security awareness. The system orchestrates realistic social engineering attacks that attempt to extract multi-factor authentication (MFA) codes from employees via AI-generated voice calls, then provides emotionally intelligent training rather than punitive responses.

**Key Capabilities:**
- Campaign management with department-based employee targeting
- SMS spam simulation (5 OTPs in 1 minute mimicking real attacks)
- AI voice agent that impersonates IT support to extract OTP codes
- Post-call transcript analysis using Claude to determine if credentials were exposed
- Safe Hours enforcement and Do Not Disturb protections for ethical testing
- Training assignment for employees who fail simulations
- Rewards system for employees who resist phishing attempts

---

## Working Prototype Stability

The frontend is a fully functional Next.js 16 application with:
- Complete dashboard with campaign creation, training assignment, and settings management
- Clerk-based multi-tenant authentication with role-based access control
- Comprehensive mock data system simulating 2,500+ employees across 8 departments
- Real-time exclusion calculations based on Safe Hours and DND configurations
- Production-ready UI with Radix UI components and Tailwind CSS

---

## Technical Complexity (Multimodal/Tool Orchestration)

VishGuard demonstrates sophisticated multimodal AI orchestration:

1. **Voice Pipeline**: LiveKit Agents Framework coordinates real-time voice communication
2. **Speech-to-Text**: ElevenLabs STT with speaker diarization captures employee responses
3. **LLM Decision Engine**: Groq-powered agent generates contextual, aggressive social engineering responses
4. **Text-to-Speech**: ElevenLabs TTS creates realistic "IT support" voice output
5. **SMS Integration**: Twilio sends coordinated OTP spam to create urgency
6. **Transcript Analysis**: Claude Sonnet 4.5 analyzes call transcripts with structured output to determine success/failure

This creates a closed-loop AI agent that listens, thinks, speaks, and evaluates—all in real-time.

---

## Innovation & Creativity

VishGuard innovates by:
- **Ethical-first design**: Built-in compliance checkboxes, Safe Hours, and DND protections ensure testing doesn't harm employees
- **Emotionally intelligent training**: Frames failures as "learning opportunities" rather than punishments
- **Multi-vector attack simulation**: Combines SMS flooding with voice calls, mimicking real-world attack patterns
- **AI-powered assessment**: Uses Claude to evaluate conversation transcripts rather than simple keyword matching
- **Organization-aware targeting**: Department hierarchies and access controls enable realistic corporate scenarios

---

## Real-World Impact

Voice phishing is a rapidly growing threat vector that bypasses traditional email-based security training. VishGuard addresses:
- **The $10B+ annual cost** of social engineering attacks to enterprises
- **The human vulnerability gap** where employees are the weakest security link
- **Compliance requirements** (SOC2, ISO 27001) for security awareness testing
- **The AI arms race** where attackers use voice cloning—defenders need equivalent tools

---

## Theme Alignment: Turning Browsers, Voices, Clouds, and Tools into Cohesive Agents

VishGuard exemplifies the hackathon theme by orchestrating:

| Element | Implementation |
|---------|----------------|
| **Browser** | Next.js dashboard for campaign management, real-time monitoring, and training delivery |
| **Voice** | ElevenLabs TTS/STT + LiveKit RTC create realistic voice AI agents that engage in conversation |
| **Cloud** | Serverless architecture with MCP (Model Context Protocol) servers coordinating distributed AI services |
| **Tools** | Twilio SMS, Groq LLM, Claude analysis, Clerk auth—all orchestrated into a unified security testing agent |

The platform transforms isolated services into a single cohesive agent that can autonomously conduct phishing simulations, assess results, and recommend training.

---

## Technologies, Frameworks, Libraries & APIs Used

### AI/Voice Services
- **ElevenLabs** - Text-to-speech (eleven_multilingual_v2, eleven_flash_v2_5), speech-to-text with diarization, conversational AI agents
- **Groq** - LLM for real-time voice agent decision-making
- **Claude Sonnet 4.5** (via Blackbox API) - Transcript analysis with structured output

### Communication Infrastructure
- **LiveKit** - Real-time WebRTC voice communication, Agents Framework, VoicePipelineAgent
- **Twilio** - SMS/MMS messaging, phone number provisioning, call management, TwiML

### Frontend
- **Next.js 16** with App Router
- **React 19** with TypeScript 5
- **Tailwind CSS v4** with PostCSS
- **Radix UI** - Avatar, Checkbox, Dialog, Dropdown, Progress, Select, Tabs
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **PapaParse** - CSV data import

### Authentication & Multi-tenancy
- **Clerk** - User authentication, organization management, RBAC (role-based access control)

### Architecture
- **MCP (Model Context Protocol)** - Sub-agent orchestration for ElevenLabs, Twilio, LiveKit specialists
- **Serverless/Edge** - Next.js middleware for auth enforcement

---

## Summary

VishGuard demonstrates how AI agents can be used defensively to protect organizations against the very same AI-powered attacks that threaten them. By turning browsers, voices, clouds, and tools into a cohesive security testing agent, the platform empowers organizations to proactively identify and train vulnerable employees before real attackers exploit them.
