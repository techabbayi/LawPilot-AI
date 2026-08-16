"use client";
import React, { useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Alexandra Vance, Esq.");
  const [email, setEmail] = useState("counsel@lawpilot.ai");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated.");
    }, 400);
  };

  return (
    <DashboardWrapper title="User Profile & Security Settings">
      <div className="space-y-8 max-w-4xl mx-auto">
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#1E3A8A]" /> User Profile & Security Credentials
            </CardTitle>
            <CardDescription>Manage display designation, email notifications, and password settings.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <Input
              label="Full Name & Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep existing password"
              icon={<Lock className="w-4 h-4" />}
            />
            <Button type="submit" isLoading={saving}>
              Save Profile Changes
            </Button>
          </form>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
