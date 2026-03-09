"use client";

import * as React from "react";
import { Topbar } from "@/components/layout/topbar";
import { PostEditor } from "@/components/feed/post-editor";
import { FeedContainer } from "@/components/feed/feed-container";
import type { Post } from "@/types";

export default function FeedPage() {
  const [newPost, setNewPost] = React.useState<Post | null>(null);

  const handlePost = (content: string, files: File[]) => {
    /* Build optimistic post and inject it into the feed */
    const optimistic: Post = {
      id: `optimistic-${Date.now()}`,
      author: {
        id: "me",
        name: "You",
        username: "me",
        avatar: null,
      },
      content,
      media: files.map((f, i) => ({
        id: `local-${i}`,
        url: URL.createObjectURL(f),
        type: f.type.startsWith("video/") ? "video" : "image",
      })),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    setNewPost(optimistic);
  };

  return (
    <>
      <Topbar title="Home" />

      <div className="animate-enter mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Post composer */}
        <PostEditor onPost={handlePost} />

        {/* Feed */}
        <FeedContainer newPost={newPost} />
      </div>
    </>
  );
}
