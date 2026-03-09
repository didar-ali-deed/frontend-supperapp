"use client";

import * as React from "react";
import { Topbar }            from "@/components/layout/topbar";
import { ProfileHeader }     from "@/components/profile/profile-header";
import { PostsGrid }         from "@/components/profile/posts-grid";
import { LazyFollowListModal, LazyEditProfileModal } from "@/components/shared/lazy-modules";
import { AboutTab }          from "@/components/profile/about-tab";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Grid3x3, FileText, BookOpen, Settings } from "lucide-react";

type FollowModal = "followers" | "following" | null;

export default function ProfilePage() {
  const [followModal, setFollowModal] = React.useState<FollowModal>(null);

  return (
    <>
      <Topbar title="Profile" />

      <div className="animate-enter mx-auto max-w-2xl px-4 py-6 space-y-5">

        {/* Profile header */}
        <ProfileHeader
          onFollowersClick={() => setFollowModal("followers")}
          onFollowingClick={() => setFollowModal("following")}
        />

        {/* Content tabs */}
        <Tabs defaultValue="posts">
          <TabList>
            <Tab value="posts">
              <span className="flex items-center gap-1.5">
                <Grid3x3 size={13} /> Posts
              </span>
            </Tab>
            <Tab value="media">
              <span className="flex items-center gap-1.5">
                <FileText size={13} /> Media
              </span>
            </Tab>
            <Tab value="about">
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} /> About
              </span>
            </Tab>
            <Tab value="settings">
              <span className="flex items-center gap-1.5">
                <Settings size={13} /> Settings
              </span>
            </Tab>
          </TabList>

          {/* Posts grid — all content */}
          <TabPanel value="posts">
            <div className="mt-4">
              <PostsGrid />
            </div>
          </TabPanel>

          {/* Media only — images & videos */}
          <TabPanel value="media">
            <div className="mt-4">
              <PostsGrid mediaOnly />
            </div>
          </TabPanel>

          {/* About + Settings */}
          <TabPanel value="about">
            <div className="mt-4">
              <AboutTab />
            </div>
          </TabPanel>

          {/* Settings points to AboutTab's settings section */}
          <TabPanel value="settings">
            <div className="mt-4">
              <AboutTab />
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Follow list modal — lazy loaded */}
      <LazyFollowListModal
        open={followModal !== null}
        onClose={() => setFollowModal(null)}
        type={followModal ?? "followers"}
      />

      {/* Edit profile modal — lazy loaded */}
      <LazyEditProfileModal />
    </>
  );
}
