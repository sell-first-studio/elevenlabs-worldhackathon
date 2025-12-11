"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Enterprise Security Training
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight mb-6">
          Secure Your Organization Against{" "}
          <span className="text-blue-600">Voice Phishing</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Simulation-based penetration testing that strengthens your team without putting real systems at risk.
          Train employees with emotional intelligence and compliance built in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/sign-up">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              See How It Works
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>No real system risk</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Ethical & compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>SOC 2 ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
