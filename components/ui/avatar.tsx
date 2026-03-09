import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Avatar Variants ──────────────────────────────────────────── */
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden bg-[var(--surface-muted)] font-medium text-[var(--text-secondary)]",
  {
    variants: {
      size: {
        "2xs": "h-5 w-5 text-[var(--text-2xs)]",
        xs:   "h-6 w-6 text-[var(--text-xs)]",
        sm:   "h-8 w-8 text-[var(--text-xs)]",
        md:   "h-10 w-10 text-[var(--text-sm)]",
        lg:   "h-12 w-12 text-[var(--text-base)]",
        xl:   "h-16 w-16 text-[var(--text-lg)]",
        "2xl":"h-24 w-24 text-[var(--text-2xl)]",
      },
      shape: {
        circle:  "rounded-full",
        square:  "rounded-[var(--radius-lg)]",
      },
    },
    defaultVariants: { size: "md", shape: "circle" },
  }
);

const PX_MAP: Record<string, number> = {
  "2xs": 20, xs: 24, sm: 32, md: 40, lg: 48, xl: 64, "2xl": 96,
};

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

function Avatar({ src, alt = "", fallback, size = "md", shape = "circle", className, ...props }: AvatarProps) {
  const px = PX_MAP[size ?? "md"] ?? 40;

  const initials = fallback
    ? fallback.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center select-none">
          {initials}
        </span>
      )}
    </div>
  );
}

/* ── AvatarGroup — stacked avatars ───────────────────────────── */
interface AvatarGroupProps {
  users: Array<{ id: string; name: string; avatar?: string | null }>;
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

function AvatarGroup({ users, max = 4, size = "sm", className }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((u) => (
        <Avatar
          key={u.id}
          src={u.avatar}
          fallback={u.name}
          size={size}
          className="ring-2 ring-[var(--surface-bg)]"
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            avatarVariants({ size, shape: "circle" }),
            "ring-2 ring-[var(--surface-bg)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
            "flex items-center justify-center text-xs font-semibold"
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup, avatarVariants };
