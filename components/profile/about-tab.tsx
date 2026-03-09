"use client";

import * as React from "react";
import {
  MapPin, Link2, Calendar, Mail, Shield,
  Bell, Eye, Lock, UserX, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { useProfileStore } from "@/lib/stores/profile.store";
import { MY_ACHIEVEMENTS } from "@/lib/data/profile.mock";

/* ── Achievement chip ─────────────────────────────────────────── */
function AchievementChip({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1.5"
      style={{ borderColor: color + "44", backgroundColor: color + "11" }}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

/* ── Toggle row ───────────────────────────────────────────────── */
function ToggleRow({
  icon,
  label,
  description,
  defaultOn = false,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = React.useState(defaultOn);

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-muted)] text-[var(--text-muted)]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]",
          on ? "bg-[var(--color-primary-600)]" : "bg-[var(--surface-border-strong)]"
        )}
        role="switch"
        aria-checked={on}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            on ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

/* ── AboutTab ─────────────────────────────────────────────────── */
export function AboutTab() {
  const { profile } = useProfileStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Bio details */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          About
        </p>
        {profile.bio && (
          <p className="mb-4 text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
            {profile.bio}
          </p>
        )}
        <div className="flex flex-col gap-2.5">
          {profile.location && (
            <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
              <MapPin size={15} className="shrink-0 text-[var(--text-muted)]" />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-2.5 text-sm">
              <Link2 size={15} className="shrink-0 text-[var(--text-muted)]" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary-600)] hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <Calendar size={15} className="shrink-0 text-[var(--text-muted)]" />
            Joined{" "}
            {new Date(profile.joinedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
            <Mail size={15} className="shrink-0 text-[var(--text-muted)]" />
            contact@{profile.username}.dev
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Achievements
        </p>
        <div className="flex flex-wrap gap-2">
          {MY_ACHIEVEMENTS.map((a) => (
            <AchievementChip key={a.id} icon={a.icon} label={a.label} color={a.color} />
          ))}
        </div>
      </div>

      {/* Privacy & Notifications */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Notifications
        </p>
        <div className="divide-y divide-[var(--surface-border)]">
          <ToggleRow
            icon={<Bell size={15} />}
            label="Push Notifications"
            description="New followers, likes and comments"
            defaultOn
          />
          <ToggleRow
            icon={<Mail size={15} />}
            label="Email Digest"
            description="Weekly summary of your activity"
          />
        </div>

        <Divider className="my-4" />

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Privacy
        </p>
        <div className="divide-y divide-[var(--surface-border)]">
          <ToggleRow
            icon={<Eye size={15} />}
            label="Public Profile"
            description="Anyone can view your profile"
            defaultOn
          />
          <ToggleRow
            icon={<Lock size={15} />}
            label="Private Posts"
            description="Only followers can see your posts"
          />
          <ToggleRow
            icon={<Shield size={15} />}
            label="Two-Factor Auth"
            description="Extra security for your account"
            defaultOn
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-danger-200)] bg-[var(--surface-bg)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-danger-600)]">
          Danger Zone
        </p>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2.5 rounded-[var(--radius-lg)] border border-[var(--surface-border)] px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-[var(--color-danger-300)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger-600)] transition-colors">
            <UserX size={15} className="shrink-0" />
            Deactivate Account
          </button>
          <button className="flex items-center gap-2.5 rounded-[var(--radius-lg)] border border-[var(--surface-border)] px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-[var(--color-danger-300)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger-600)] transition-colors">
            <Trash2 size={15} className="shrink-0" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
