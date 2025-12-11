"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">PhishGuard</span>
            </Link>
            <p className="text-sm text-gray-600">
              Enterprise voice phishing simulation and training platform.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link></li>
              <li><Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Security</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookie Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} PhishGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
