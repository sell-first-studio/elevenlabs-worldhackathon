import random
import time
from dataclasses import dataclass
from twilio.rest import Client

from .config import Config


@dataclass
class OTPMessage:
    code: str
    timestamp: float
    message_sid: str


def generate_otp() -> str:
    """Generate a 6-digit OTP code."""
    return str(random.randint(100000, 999999))


def format_microsoft_otp_message(code: str) -> str:
    """Format OTP message in Microsoft style."""
    return f"Your security code is {code}. Don't share it with anyone."


class SMSBombardment:
    def __init__(self, config: Config):
        self.client = Client(config.twilio_account_sid, config.twilio_auth_token)
        self.from_number = config.twilio_sms_phone
        self.sent_otps: list[OTPMessage] = []

    def generate_intervals(self, count: int = 5, total_seconds: float = 60.0) -> list[float]:
        """Generate irregular intervals that sum to approximately total_seconds."""
        # Generate random weights
        weights = [random.random() for _ in range(count - 1)]
        total_weight = sum(weights)

        # Scale weights to fit total time, leaving some buffer
        intervals = [(w / total_weight) * (total_seconds * 0.8) for w in weights]

        # Add some randomness
        intervals = [max(3.0, i + random.uniform(-2, 2)) for i in intervals]

        return intervals

    def send_otp_burst(
        self,
        to_number: str,
        count: int = 5,
        on_send: callable = None
    ) -> list[OTPMessage]:
        """Send a burst of OTP messages with irregular intervals."""
        intervals = self.generate_intervals(count)

        for i in range(count):
            code = generate_otp()
            body = format_microsoft_otp_message(code)

            message = self.client.messages.create(
                to=to_number,
                from_=self.from_number,
                body=body
            )

            otp = OTPMessage(
                code=code,
                timestamp=time.time(),
                message_sid=message.sid
            )
            self.sent_otps.append(otp)

            if on_send:
                on_send(i + 1, count, code)

            # Wait before next message (except for last one)
            if i < count - 1:
                time.sleep(intervals[i])

        return self.sent_otps

    def get_valid_codes(self) -> list[str]:
        """Return all OTP codes that were sent."""
        return [otp.code for otp in self.sent_otps]
