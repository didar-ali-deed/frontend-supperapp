"use client";

import * as React from "react";
import { Search, UserCheck, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { useProfileStore } from "@/lib/stores/profile.store";
import { VerificationBadge } from "./profile-header";
import { MOCK_FOLLOWERS, MOCK_FOLLOWING } from "@/lib/data/profile.mock";
import type { FollowUser } from "@/lib/data/profile.mock";

/* ── Follow row ───────────────────────────────────────────────── */
function FollowRow({ user }: { user: FollowUser }) {
  const { toggleFollow, isFollowing } = useProfileStore();
  const following = isFollowing(user.id);

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Avatar src={user.avatar} fallback={user.name} size="md" />

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {user.name}
          </p>
          <VerificationBadge tier={user.verified ? "blue" : null} size={14} />
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate">@{user.username}</p>
        {user.bio && (
          <p className="text-xs text-[var(--text-muted)] truncate">{user.bio}</p>
        )}
      </div>

      <button
        onClick={() => toggleFollow(user.id)}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
          following
            ? "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-red-300 hover:text-red-500"
            : "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]"
        )}
      >
        {following
          ? <><UserCheck size={12} /> Following</>
          : <><UserPlus  size={12} /> Follow</>
        }
      </button>
    </div>
  );
}

/* ── FollowListModal ──────────────────────────────────────────── */
interface FollowListModalProps {
  open:    boolean;
  onClose: () => void;
  type:    "followers" | "following";
}

export function FollowListModal({ open, onClose, type }: FollowListModalProps) {
  const [search, setSearch] = React.useState("");

  const source = type === "followers" ? MOCK_FOLLOWERS : MOCK_FOLLOWING;

  const filtered = source.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader
        title={type === "followers" ? "Followers" : "Following"}
      />
      <ModalBody className="p-0">
        {/* Search */}
        <div className="px-5 pb-3 pt-1">
          <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-3 py-2 focus-within:border-[var(--color-primary-400)] focus-within:bg-[var(--surface-bg)] transition-all">
            <Search size={14} className="shrink-0 text-[var(--text-muted)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-[var(--surface-border)]">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--text-muted)]">
              No users found.
            </p>
          ) : (
            filtered.map((user) => <FollowRow key={user.id} user={user} />)
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
