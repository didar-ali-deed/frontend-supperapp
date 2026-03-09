"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPin, Link2, Calendar, BadgeCheck,
  Settings, UserPlus, UserCheck, MessageCircle,
  Camera, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/lib/stores/profile.store";
import type { ProfileUser } from "@/lib/data/profile.mock";

/* ── Verification badge ───────────────────────────────────────── */
export function VerificationBadge({
  tier,
  size = 16,
}: {
  tier: ProfileUser["verificationTier"];
  size?: number;
}) {
  if (!tier) return null;
  const isGold = tier === "gold";
  return (
    <span
      title={isGold ? "Gold Verified Creator" : "Verified"}
      className="inline-flex shrink-0"
    >
      {isGold ? (
        <Star
          size={size}
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth={1.5}
          className="drop-shadow-sm"
        />
      ) : (
        <BadgeCheck
          size={size}
          className="text-[var(--color-primary-500)] drop-shadow-sm"
          strokeWidth={2}
        />
      )}
    </span>
  );
}

/* ── Stat button ──────────────────────────────────────────────── */
function StatBtn({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-1 rounded-[var(--radius-lg)] transition-colors",
        onClick && "hover:bg-[var(--surface-muted)] cursor-pointer"
      )}
    >
      <span className="text-lg font-bold tabular-nums text-[var(--text-primary)]">
        {formatCount(value)}
      </span>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
    </button>
  );
}

/* ── ProfileHeader ────────────────────────────────────────────── */
interface ProfileHeaderProps {
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  /** Pass a userId to show as someone else's profile; omit for own profile */
  viewingUserId?: string;
}

export function ProfileHeader({
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) {
  const { profile, openEdit, toggleFollow, isFollowing } = useProfileStore();
  const isOwn  = true; // In a real app: profile.id === authedUserId
  const following = isFollowing(profile.id);

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-[var(--shadow-sm)]">
      {/* Cover */}
      <div className="relative h-36 sm:h-48 w-full">
        {profile.coverUrl ? (
          <Image
            src={profile.coverUrl}
            alt="Cover"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
            priority
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${profile.coverGradient[0]}, ${profile.coverGradient[1]})`,
            }}
          />
        )}

        {/* Cover edit overlay */}
        {isOwn && (
          <button
            onClick={openEdit}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            title="Change cover photo"
          >
            <Camera size={14} />
          </button>
        )}
      </div>

      <div className="px-4 pb-5 sm:px-6">
        {/* Avatar row */}
        <div className="-mt-12 mb-3 flex items-end justify-between">
          <div className="relative">
            <Avatar
              src={profile.avatar}
              fallback={profile.name}
              size="2xl"
              className="ring-4 ring-[var(--surface-bg)]"
            />
            {isOwn && (
              <button
                onClick={openEdit}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-white shadow-md hover:bg-[var(--color-primary-700)] transition-colors"
                title="Change profile photo"
              >
                <Camera size={12} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-1">
            {isOwn ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Settings size={14} />}
                onClick={openEdit}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={following ? "outline" : "primary"}
                  size="sm"
                  leftIcon={following ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  onClick={() => toggleFollow(profile.id)}
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<MessageCircle size={14} />}
                >
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name + verification */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {profile.name}
            </h1>
            <VerificationBadge tier={profile.verificationTier} size={20} />
            {profile.role === "creator" && (
              <Badge variant="primary" size="sm">Creator</Badge>
            )}
          </div>

          <p className="text-sm text-[var(--text-muted)]">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-0.5">
            {profile.location && (
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <MapPin size={12} /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--color-primary-600)] hover:underline"
              >
                <Link2 size={12} />
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Calendar size={12} />
              Joined{" "}
              {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-1 mt-2 -ml-3">
            <StatBtn label="Posts"     value={profile.postsCount}     />
            <StatBtn label="Followers" value={profile.followersCount} onClick={onFollowersClick} />
            <StatBtn label="Following" value={profile.followingCount} onClick={onFollowingClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
