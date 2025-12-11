# Future TODO

Brainstormed features and enhancements for the vishing pentest tool.

## Immediate Priorities (Complete MVP)
- [ ] Implement `analyzer.py` from plan (Phase 4 code exists in plan)
- [ ] Implement `cli.py` from plan (Phase 5 code exists in plan)
- [ ] Add retry logic for Twilio/LiveKit/Blackbox API failures (not in plan)
- [ ] Create integration test suite in `tests/` (strategy in plan, no code)

Here the plan means @thoughts/shared/plans/2025-12-11-voice-phishing-pentest-tool.md

Preferred next features: 
- [ ] Teachable Moment SMS - Send results via SMS 60 seconds after call ends with personalized feedback ("This was a simulation. You did great by asking X, but missed Y.")
- [ ] Convex - Implement a database to store status and results to share with frontend.
- [ ] API endpoints and connecting to the frontend
- [ ] Background office noise / call center ambiance
- [ ] Batch testing across multiple targets

## Attack Scenario Variations
- [ ] Multiple IT personas (Helpdesk, Security Team, HR, Finance)
- [ ] Different urgency levels (low-key vs aggressive social engineering)
- [ ] Pretext variations (account compromise, policy change, audit)
- [ ] Callback scenarios (agent asks target to call back)
- [ ] Multi-stage attacks (email + SMS + voice combo)

## Voice & Audio Enhancements
- [ ] Multiple voice options beyond Rachel (male voices, accents)
- [ ] Call quality degradation to sound more realistic
- [ ] Customizable speech rate and emotion parameters

## Intelligence & Adaptability
- [ ] Real-time sentiment analysis during calls
- [ ] Hesitation detection to adjust tactics mid-call
- [ ] Dynamic script adaptation based on target responses
- [ ] Keyword triggers for escalation or de-escalation
- [ ] Learning from successful/failed attempts

## Campaign Management
- [ ] Scheduling system for timed campaigns

## Reporting & Compliance
- [ ] GDPR-compliant data handling and auto-deletion
- [ ] PDF report generation with findings summary
- [ ] Executive summary vs detailed technical report
- [ ] Chain of custody documentation for legal defense ???
- [ ] Integration with common GRC platforms ???

## Enterprise Integration
- [ ] SIEM integration (Splunk, Elastic, etc.) ???
- [ ] Webhook notifications on campaign completion
- [ ] Role-based access control (team leads, admins)

## Training & Feedback Loop

- [ ] Automated post-test disclosure call to targets
- [ ] Training material delivery after failed test
- [ ] Phishing awareness score tracking over time
- [ ] Gamification for security awareness programs
- [ ] Anonymous aggregate reporting for org benchmarks

## Technical Improvements
- [ ] Caller ID spoofing (where legally permitted)
- [ ] Multi-region deployment for latency optimization
- [ ] Call recording with secure storage
- [ ] Transcript search and filtering
- [ ] Rate limiting and quota management

## Defensive Features
- [ ] "Canary" mode that alerts security team during test
- [ ] Real-time intervention capability for observers
- [ ] Safe word detection to immediately end call
- [ ] Consent verification before live testing
- [ ] Automated legal disclaimer playback option
