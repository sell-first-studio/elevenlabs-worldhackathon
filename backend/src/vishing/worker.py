#!/usr/bin/env python
"""Standalone agent worker - run this before making calls.

Usage:
    uv run vishing-worker dev

The worker must be running before initiating calls, as it listens
for dispatch requests from LiveKit and handles the voice agent logic.
"""
from livekit.agents import cli

from .voice_agent import create_worker_options


def main():
    """Start the agent worker."""
    worker_options = create_worker_options()
    cli.run_app(worker_options)


if __name__ == "__main__":
    main()
