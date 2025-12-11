import json
import httpx
from dataclasses import dataclass
from pydantic import BaseModel

from .config import Config


class AnalysisResult(BaseModel):
    success: bool
    extracted_otp: str | None
    confidence: str  # "high", "medium", "low"
    reasoning: str
    risk_assessment: str
    recommendations: list[str]


ANALYSIS_PROMPT = """Analyze this voice phishing penetration test transcript. The attacker posed as IT support and tried to extract an OTP code from the target.

Valid OTP codes that were sent: {valid_codes}

Transcript:
{transcript}

Analyze the transcript and provide a structured assessment:

1. Did the target disclose any OTP code? If yes, which one?
2. How confident are you in this assessment?
3. Explain your reasoning
4. Rate the security risk (how susceptible was the target?)
5. Provide recommendations for the target's security training

Respond in this exact JSON format:
{{
    "success": true/false,
    "extracted_otp": "123456" or null,
    "confidence": "high"/"medium"/"low",
    "reasoning": "explanation of what happened",
    "risk_assessment": "assessment of target's susceptibility",
    "recommendations": ["recommendation 1", "recommendation 2"]
}}
"""


class TranscriptAnalyzer:
    def __init__(self, config: Config):
        self.api_key = config.blackbox_api_key
        self.api_url = "https://api.blackbox.ai/api/chat"

    def format_transcript(self, transcript: list[dict]) -> str:
        """Format transcript for analysis."""
        lines = []
        for msg in transcript:
            role = "TARGET" if msg["role"] == "user" else "IT SUPPORT (attacker)"
            lines.append(f"{role}: {msg['content']}")
        return "\n".join(lines)

    async def analyze(
        self,
        transcript: list[dict],
        valid_codes: list[str]
    ) -> AnalysisResult:
        """Analyze the transcript using Blackbox AI."""

        formatted_transcript = self.format_transcript(transcript)

        prompt = ANALYSIS_PROMPT.format(
            valid_codes=", ".join(valid_codes),
            transcript=formatted_transcript
        )

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "claude-sonnet-4-5-20241022",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 1000
                },
                timeout=60.0
            )
            response.raise_for_status()

            data = response.json()
            content = data["choices"][0]["message"]["content"]

            # Parse JSON from response
            # Handle potential markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]

            result_data = json.loads(content.strip())
            return AnalysisResult(**result_data)

    def check_otp_match(self, extracted_otp: str | None, valid_codes: list[str]) -> bool:
        """Check if extracted OTP matches any sent code."""
        if not extracted_otp:
            return False
        return extracted_otp in valid_codes


def save_analysis(
    analysis: AnalysisResult,
    valid_codes: list[str],
    output_dir: str = "results"
) -> str:
    """Save analysis results to file."""
    import os
    from datetime import datetime

    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{output_dir}/analysis_{timestamp}.json"

    data = {
        "analysis": analysis.model_dump(),
        "valid_codes": valid_codes,
        "otp_match": analysis.extracted_otp in valid_codes if analysis.extracted_otp else False,
        "timestamp": datetime.now().isoformat()
    }

    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

    return filename
