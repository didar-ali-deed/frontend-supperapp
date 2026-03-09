"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useProfileStore } from "@/lib/stores/profile.store";

/* ── Schema ───────────────────────────────────────────────────── */
const schema = z.object({
  name:     z.string().min(2, "At least 2 characters").max(60, "Max 60 characters"),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(30, "Max 30 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores"),
  bio:      z.string().max(160, "Max 160 characters").optional(),
  website:  z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().max(60, "Max 60 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

/* ── Field wrapper ────────────────────────────────────────────── */
function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--text-secondary)]">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-[var(--color-danger-600)]">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "w-full rounded-[var(--radius-lg)] border px-3 py-2.5 text-sm text-[var(--text-primary)]",
    "bg-[var(--surface-bg)] placeholder:text-[var(--text-muted)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)] transition-shadow",
    hasError
      ? "border-[var(--color-danger-400)]"
      : "border-[var(--surface-border)] hover:border-[var(--surface-border-strong)]"
  );

/* ── EditProfileModal ─────────────────────────────────────────── */
export function EditProfileModal() {
  const { profile, isEditOpen, closeEdit, saveProfile } = useProfileStore();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     profile.name,
      username: profile.username,
      bio:      profile.bio ?? "",
      website:  profile.website ?? "",
      location: profile.location ?? "",
    },
  });

  /* Reset form when modal opens */
  React.useEffect(() => {
    if (isEditOpen) {
      reset({
        name:     profile.name,
        username: profile.username,
        bio:      profile.bio ?? "",
        website:  profile.website ?? "",
        location: profile.location ?? "",
      });
      setAvatarPreview(null);
      setSaved(false);
    }
  }, [isEditOpen, profile, reset]);

  const bioValue = watch("bio") ?? "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const onSubmit = (data: FormValues) => {
    saveProfile({
      name:     data.name,
      username: data.username,
      bio:      data.bio ?? "",
      website:  data.website ?? "",
      location: data.location ?? "",
      ...(avatarPreview ? { avatar: avatarPreview } : {}),
    });
    setSaved(true);
    setTimeout(() => closeEdit(), 800);
  };

  return (
    <Modal open={isEditOpen} onClose={closeEdit} size="md">
      <ModalHeader title="Edit Profile" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="flex flex-col gap-5 py-4">

          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar
                src={avatarPreview ?? profile.avatar}
                fallback={profile.name}
                size="2xl"
                className="ring-4 ring-[var(--surface-border)]"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-white shadow-md hover:bg-[var(--color-primary-700)] transition-colors"
              >
                <Camera size={14} />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="text-xs font-semibold text-[var(--color-primary-600)] hover:underline"
            >
              Change profile photo
            </button>
          </div>

          {/* Name */}
          <Field label="Display Name" error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="Your name"
              className={inputCls(!!errors.name)}
            />
          </Field>

          {/* Username */}
          <Field
            label="Username"
            error={errors.username?.message}
            hint="Letters, numbers and underscores only"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                @
              </span>
              <input
                {...register("username")}
                placeholder="username"
                className={cn(inputCls(!!errors.username), "pl-7")}
              />
            </div>
          </Field>

          {/* Bio */}
          <Field
            label="Bio"
            error={errors.bio?.message}
            hint={`${bioValue.length} / 160`}
          >
            <textarea
              {...register("bio")}
              placeholder="Tell the world about yourself…"
              rows={3}
              maxLength={160}
              className={cn(inputCls(!!errors.bio), "resize-none leading-relaxed")}
            />
          </Field>

          {/* Location */}
          <Field label="Location" error={errors.location?.message}>
            <input
              {...register("location")}
              placeholder="City, Country"
              className={inputCls(!!errors.location)}
            />
          </Field>

          {/* Website */}
          <Field label="Website" error={errors.website?.message}>
            <input
              {...register("website")}
              placeholder="https://yoursite.com"
              type="url"
              className={inputCls(!!errors.website)}
            />
          </Field>
        </ModalBody>

        <ModalFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={closeEdit}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={saved ? "success" : "primary"}
            className="flex-1"
            disabled={!isDirty && !avatarPreview}
            leftIcon={saved ? <Check size={14} /> : undefined}
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
