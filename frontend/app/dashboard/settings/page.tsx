"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Globe, Calendar, CheckCircle, Info } from "lucide-react";
import { mockSafeHoursConfig } from "@/lib/mock-data";
import { TIMEZONES, SafeHoursConfig } from "@/lib/types";
import { formatTimeRange, getTimezoneAbbreviation } from "@/lib/safe-hours";

export default function SettingsPage() {
  const [config, setConfig] = useState<SafeHoursConfig>(mockSafeHoursConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Mock save - in production this would persist to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateConfig = (updates: Partial<SafeHoursConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Settings"
        description="Configure organization-wide settings for PhishGuard"
      />

      <main className="p-8 space-y-6">
        {/* Safe Hours Configuration */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Safe Hours Configuration</CardTitle>
                <CardDescription>
                  Define when simulation calls can be made to employees
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <div className="font-medium text-gray-900">
                  Enable Safe Hours Enforcement
                </div>
                <div className="text-sm text-gray-500">
                  When enabled, calls will only be made during the configured time window
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => updateConfig({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.enabled && (
              <>
                {/* Timezone Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Globe className="h-4 w-4" />
                    Default Timezone
                  </label>
                  <select
                    value={config.defaultTimezone}
                    onChange={(e) => updateConfig({ defaultTimezone: e.target.value })}
                    className="w-full md:w-80 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Current time in {getTimezoneAbbreviation(config.defaultTimezone)}:{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      timeZone: config.defaultTimezone,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Time Window */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Allowed Call Window
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={config.startTime}
                      onChange={(e) => updateConfig({ startTime: e.target.value })}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={config.endTime}
                      onChange={(e) => updateConfig({ endTime: e.target.value })}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Calls will only be made between{" "}
                    {formatTimeRange(config.startTime, config.endTime)}
                  </p>
                </div>

                {/* Weekend Exclusion */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="excludeWeekends"
                    checked={config.excludeWeekends}
                    onCheckedChange={(checked) =>
                      updateConfig({ excludeWeekends: checked === true })
                    }
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="excludeWeekends"
                      className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer"
                    >
                      <Calendar className="h-4 w-4" />
                      Exclude Weekends
                    </label>
                    <p className="text-sm text-gray-500">
                      No simulation calls will be made on Saturdays and Sundays
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Current Configuration:</strong> Calls are permitted{" "}
                    {formatTimeRange(config.startTime, config.endTime)} (
                    {getTimezoneAbbreviation(config.defaultTimezone)})
                    {config.excludeWeekends && ", Monday through Friday only"}.
                  </div>
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Button onClick={handleSave}>
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              {saved && (
                <span className="text-sm text-green-600">
                  Settings saved successfully
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Future Settings Placeholder */}
        <Card className="bg-white border-dashed">
          <CardHeader>
            <CardTitle className="text-lg text-gray-400">
              More Settings Coming Soon
            </CardTitle>
            <CardDescription>
              Additional configuration options will be available here, including
              notification preferences, integration settings, and more.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Per-Employee Override Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Coming Soon:</strong> Per-employee timezone and safe hours
                overrides. This will allow you to configure individual employees with
                different time zones or custom call windows based on their location or
                preferences.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
