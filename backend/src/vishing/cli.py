import argparse
import asyncio
import sys
import time
import uuid
from datetime import datetime

from .config import load_config
from .sms import SMSBombardment
from .voice_agent import CallSession, make_outbound_call, save_transcript
from .analyzer import TranscriptAnalyzer, save_analysis


def print_status(message: str):
    """Print timestamped status message."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")


def print_sms_progress(current: int, total: int, code: str):
    """Callback for SMS sending progress."""
    print_status(f"SMS {current}/{total} sent (code: {code})")


async def run_attack(phone: str, name: str):
    """Execute the full vishing attack flow."""
    config = load_config()

    print_status("=" * 50)
    print_status("VISHING PENETRATION TEST")
    print_status("=" * 50)
    print_status(f"Target: {name}")
    print_status(f"Phone: {phone}")
    print_status("=" * 50)

    # Phase 1: SMS Bombardment
    print_status("")
    print_status("PHASE 1: SMS BOMBARDMENT")
    print_status("-" * 30)

    sms = SMSBombardment(config)
    sms.send_otp_burst(
        to_number=phone,
        count=5,
        on_send=print_sms_progress
    )

    valid_codes = sms.get_valid_codes()
    print_status(f"All OTP codes sent: {', '.join(valid_codes)}")

    # Brief pause before call
    print_status("")
    print_status("Waiting 10 seconds before initiating call...")
    time.sleep(10)

    # Phase 2: Voice Call
    print_status("")
    print_status("PHASE 2: VOICE CALL")
    print_status("-" * 30)

    session = CallSession(
        target_name=name,
        target_phone=phone,
        room_name=f"vishing-{uuid.uuid4().hex[:8]}"
    )

    print_status(f"Initiating call from IT Support...")
    print_status(f"Room: {session.room_name}")

    try:
        session = await make_outbound_call(config, session)
        print_status("Call initiated. Waiting for call to complete...")

        # Wait for call to complete (this is simplified - in production
        # you'd use webhooks or poll for room status)
        # For now, we'll wait for user input
        print_status("")
        print_status("Press Enter when the call has ended...")
        input()

        session.call_ended = datetime.now().isoformat()

    except Exception as e:
        print_status(f"Error during call: {e}")
        return

    # Save transcript
    if session.transcript:
        transcript_file = save_transcript(session)
        print_status(f"Transcript saved: {transcript_file}")
    else:
        print_status("No transcript captured")

    # Phase 3: Analysis
    print_status("")
    print_status("PHASE 3: TRANSCRIPT ANALYSIS")
    print_status("-" * 30)

    if not session.transcript:
        print_status("No transcript to analyze. Skipping analysis.")
        return

    print_status("Analyzing transcript with Claude Sonnet 4.5...")

    analyzer = TranscriptAnalyzer(config)
    transcript_data = [
        {"role": m.role, "content": m.content, "timestamp": m.timestamp}
        for m in session.transcript
    ]

    try:
        result = await analyzer.analyze(transcript_data, valid_codes)

        # Save analysis
        analysis_file = save_analysis(result, valid_codes)
        print_status(f"Analysis saved: {analysis_file}")

        # Print results
        print_status("")
        print_status("=" * 50)
        print_status("RESULTS")
        print_status("=" * 50)
        print_status(f"Attack Success: {'YES' if result.success else 'NO'}")

        if result.extracted_otp:
            otp_match = result.extracted_otp in valid_codes
            print_status(f"Extracted OTP: {result.extracted_otp} ({'VALID' if otp_match else 'INVALID'})")
        else:
            print_status("Extracted OTP: None")

        print_status(f"Confidence: {result.confidence}")
        print_status("")
        print_status("Reasoning:")
        print_status(f"  {result.reasoning}")
        print_status("")
        print_status("Risk Assessment:")
        print_status(f"  {result.risk_assessment}")
        print_status("")
        print_status("Recommendations:")
        for rec in result.recommendations:
            print_status(f"  - {rec}")

    except Exception as e:
        print_status(f"Error during analysis: {e}")
        raise


def main():
    parser = argparse.ArgumentParser(
        description="Voice phishing penetration testing tool"
    )
    parser.add_argument(
        "--phone", "-p",
        required=True,
        help="Target phone number (E.164 format, e.g., +14155551234)"
    )
    parser.add_argument(
        "--name", "-n",
        required=True,
        help="Target's name"
    )
    parser.add_argument(
        "--sms-only",
        action="store_true",
        help="Only send SMS messages, don't make call"
    )

    args = parser.parse_args()

    # Validate phone format
    if not args.phone.startswith("+"):
        print("Error: Phone number must be in E.164 format (e.g., +14155551234)")
        sys.exit(1)

    try:
        if args.sms_only:
            # SMS only mode for testing
            config = load_config()
            sms = SMSBombardment(config)
            print_status("SMS-only mode")
            sms.send_otp_burst(args.phone, count=5, on_send=print_sms_progress)
            print_status("Done!")
        else:
            asyncio.run(run_attack(args.phone, args.name))
    except KeyboardInterrupt:
        print_status("\nAborted by user")
        sys.exit(1)
    except Exception as e:
        print_status(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
