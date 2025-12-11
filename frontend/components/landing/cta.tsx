"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
          Ready to strengthen your organization?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Start your free trial today. No credit card required. See results within your first campaign.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-8 text-base">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/30 bg-transparent text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
