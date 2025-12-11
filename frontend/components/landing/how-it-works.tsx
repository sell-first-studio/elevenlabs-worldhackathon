"use client";

import { ShieldCheck, Play, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: ShieldCheck,
    step: "01",
    title: "Onboard Org Securely",
    description: "Configure your organization with built-in consent verification. We ensure compliance and data privacy before launch."
  },
  {
    icon: Play,
    step: "02",
    title: "Launch Campaign",
    description: "Confirm compliance with ethical and legal policies, then launch your simulation. Our system handles the rest automatically."
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Track & Train",
    description: "Monitor real-time results, identify vulnerable employees, and assign targeted training. Reward those who pass with gifts."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gray-200" />
              )}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 relative">
                  <step.icon className="h-10 w-10 text-blue-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
