"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Scale, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Simulation-Based Testing",
    description: "Run realistic voice phishing simulations without any risk to your actual systems or data. Safe, controlled, and effective."
  },
  {
    icon: Target,
    title: "Campaign Management",
    description: "Easily orchestrate penetration tests across teams or the entire organization. Track progress and measure results in real-time."
  },
  {
    icon: Scale,
    title: "Ethical & Legal Compliance",
    description: "Built-in policy enforcement ensures all campaigns follow ethical guidelines and corporate policies. Full audit trail included."
  },
  {
    icon: Heart,
    title: "Emotionally Intelligent Training & Positive Reinforcement",
    description: "Strengthen your team without shaming. Our approach focuses on education, positive reinforcement through rewards, and improvement—not punishment."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Everything you need for security awareness
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete platform for running voice phishing simulations, tracking results, and training your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
