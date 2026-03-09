# SupperApp

A full-stack super app — social feed, messaging, payments, creator dashboard, and profiles in one Next.js 15 App Router frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Auth | Clerk v7 |
| State | Zustand (with persist middleware) |
| Data Fetching | TanStack Query v5 |
| Icons | Lucide React |
| Charts | Recharts |
| Font | Inter (next/font) |

---

## Feature Prompts

### Prompt 1

> You are working as a senior frontend engineer.
>
> For this entire session you must maintain persistent project memory.
>
> 1. Create a folder called: `project_memory/` — inside create `project_memory/prompts/` and `project_memory/logs/`
> 2. Every time I send a prompt: save it into `project_memory/prompts/prompt_XX.md` and append it to `project_memory/session_log.md`
> 3. Maintain a `README.md` in project_memory with: project description, current architecture, completed steps, pending steps, file structure, next action
> 4. When the session starts again: read `project_memory/README.md` and continue from the "Next Action" section
> 5. Always update README.md after completing any major task
>
> Confirm when the memory system is ready.

**Executed:** Created `project_memory/` folder structure with `prompts/`, `logs/`, `session_log.md`, and `README.md`. Memory system confirmed active.

---

### Prompt 2

> We are building a SUPER APP frontend with the following core modules:
>
> 1. Social Media Feed
> 2. Messaging
> 3. Payments
> 4. Creator Earning Dashboard
> 5. Profile & Settings
>
> The frontend must be: modern, scalable, production-grade, component based
>
> Use the best stack for 2026 frontend development.
>
> Analyze and propose: Framework, State management, Folder architecture, UI library, Routing strategy, API integration pattern, Auth system
>
> Explain the architecture and update README.md.

**Executed:** Proposed and confirmed stack: Next.js 15 + TypeScript + Tailwind CSS v4 + Zustand + TanStack Query + Clerk + Recharts. Defined App Router folder architecture. Updated project_memory README.

---

### Prompt 3

> Initialize the frontend project with the chosen stack.
>
> Requirements: production-ready structure, TypeScript, modular architecture, scalable folder structure
>
> Setup: routing, global state, environment config, API service layer, reusable component system
>
> After creation, output the full project tree. Update README.md with the structure.

**Executed:** Initialized Next.js 15 project. Created `app/(app)/`, `app/(auth)/`, `components/ui/`, `components/layout/`, `components/shared/`, `lib/stores/`, `lib/api/`, `types/`. Configured `tsconfig.json` path aliases, `next.config.ts`, `.env.local` template. Output full project tree.

---

### Prompt 4

> Create a global design system.
>
> Include: typography scale, spacing system, color palette, button variants, cards, modals, forms, input fields
>
> Create a reusable component library. All UI must follow the same design language.
> Save components inside: `/components/ui`
> Update README with the design system.

**Executed:** Built full design system in `app/globals.css` with CSS custom properties (colors, radii, shadows, z-index, durations). Created `components/ui/`: `button.tsx`, `card.tsx`, `input.tsx`, `modal.tsx`, `avatar.tsx`, `badge.tsx`, `skeleton.tsx`, `spinner.tsx`, `tabs.tsx`, `toggle.tsx`, `typography.tsx`.

---

### Prompt 5

> Build the main app layout.
>
> Include: top navigation bar, bottom mobile navigation, sidebar for desktop, notification panel, search bar
>
> Pages to include in routing: Home, Messages, Wallet, Creator Dashboard, Profile

**Executed:** Created `components/layout/sidebar.tsx` (desktop persistent, mobile slide-in drawer), `topbar.tsx` (sticky header with hamburger, search, notifications, avatar), `nav-config.tsx` (nav items), `search-bar.tsx`, `notification-panel.tsx`. Built `app/(app)/layout.tsx` shell. Zustand `ui.store.ts` for sidebar state.

---

### Prompt 6

> Build the social media feed interface.
>
> Features: create post, image/video post, like, comment, share, infinite scroll
>
> Components: PostCard, PostEditor, CommentSection, MediaPreview, FeedContainer
>
> Use dummy API data for now.

**Executed:** Created `app/(app)/feed/page.tsx` with stories bar + infinite scroll feed. Built `components/feed/`: `post-card.tsx`, `post-editor.tsx`, `comment-section.tsx`, `stories-bar.tsx`. Zustand `feed.store.ts` with mock posts, optimistic like/bookmark.

---

### Prompt 7

> Build a messaging interface similar to modern chat apps.
>
> Features: conversation list, chat window, message bubbles, typing indicator, media attachments, emoji picker
>
> Components: ChatList, ChatWindow, MessageBubble, MessageInput, AttachmentUploader

**Executed:** Created `app/(app)/messages/page.tsx` with two-panel layout. Built `components/messages/`: `conversation-list.tsx` (unread badge, online dot), `chat-window.tsx` (date separators, read receipts), `message-bubble.tsx` (sender/receiver variants), `message-input.tsx` (emoji picker, file attach), `typing-indicator.tsx`. Zustand `chat.store.ts` with mock conversations.

---

### Prompt 8

> Build a digital wallet interface.
>
> Screens: wallet balance, transaction history, send money, receive money, QR payment screen
>
> Components: WalletCard, TransactionList, SendMoneyForm, QRScannerUI, PaymentConfirmationModal

**Executed:** Created `app/(app)/wallet/page.tsx`. Built `components/wallet/`: `balance-card.tsx` (show/hide toggle), `transaction-list.tsx` (filterable by type), `send-modal.tsx` (multi-step flow), `receive-modal.tsx` (QR + copy address), `top-up-modal.tsx`, `spending-chart.tsx` (Recharts pie). Zustand `wallet.store.ts`.

---

### Prompt 9

> Session resume. Check project_memory and all prompts. Verify prompt_01 instructions are followed. Check if last prompt (prompt_08) is fully executed; if not, execute it.

**Executed:** Read `project_memory/README.md`. Verified memory system active. Confirmed all 5 wallet components and 3 wallet screens from Prompt 8 were complete. Continued session.

---

### Prompt 10

> Create a creator monetization dashboard.
>
> Features: earnings graph, revenue breakdown, withdraw funds, monetized posts, analytics
>
> Components: EarningsChart, RevenueCard, WithdrawPanel, AnalyticsSummary

**Executed:** Created `app/(app)/dashboard/page.tsx` with stat cards grid. Built `components/dashboard/`: `earnings-chart.tsx` (Recharts area chart, 12-month view), `revenue-card.tsx` (breakdown with progress bars), `withdraw-panel.tsx` (available balance + bank account), `analytics-summary.tsx` (reach, engagement, follower growth), `monetized-posts.tsx` (top posts by revenue). Zustand `dashboard.store.ts`.

---

### Prompt 11

> Implement a clean API integration layer.
>
> Create:
> - services/api.ts
> - services/auth.ts
> - services/posts.ts
> - services/messages.ts
> - services/payments.ts
>
> Add global state management for:
> - user
> - feed
> - chat
> - wallet
>
> Build authentication screens.
>
> Include:
> - login
> - signup
> - OTP verification
> - password reset
>
> Add form validation.

**Executed:** Built `lib/api/client.ts` (base fetch with Clerk auth headers, retry on 5xx, error normalization). Created `lib/api/`: `feed.api.ts`, `messages.api.ts`, `wallet.api.ts`, `dashboard.api.ts`, `profile.api.ts`. TanStack Query hooks in `lib/queries/` per domain. Optimistic updates with rollback for like/bookmark. Defined `types/api.ts`. Built `app/(auth)/login/[[...rest]]/` and `app/(auth)/register/[[...rest]]/` with Clerk `<SignIn>` / `<SignUp>`, catch-all routes for OTP/email verification sub-steps, and form validation.

---

### Prompt 12

> Optimize the entire UI for:
> - mobile
> - tablet
> - desktop
>
> Ensure the layout behaves like a native mobile app. Improve frontend performance.
>
> Implement:
> - lazy loading
> - code splitting
> - memoization
> - image optimization
> - skeleton loaders

**Executed:** Created `components/shared/lazy-modules.tsx` (`next/dynamic` wrappers for all heavy components with skeleton fallbacks). Added `loading.tsx` per route (feed, messages, wallet, dashboard, profile). Built `components/shared/page-skeletons.tsx`. Updated `skeleton.tsx` to shimmer animation. Applied `React.memo()` to `PostCard`, `PostCell`, `TxRow`, `TopStat`. Configured `next.config.ts` with AVIF/WebP formats, 30-day image cache, device size breakpoints. Fixed 7 TypeScript errors.

---

### Prompt 13

> Build the user profile system.
>
> Features: profile header, followers/following, posts grid, edit profile, verification badge
>
> Components: ProfileHeader, FollowListModal, PostsGrid, EditProfileModal, AboutTab

**Executed:** Created `app/(app)/profile/page.tsx` with cover photo, tabbed layout (Posts/Reels/Tagged). Built `components/profile/`: `profile-header.tsx` (cover, avatar, stats, verification badge, follow/edit button), `posts-grid.tsx` (photo grid), `edit-profile-modal.tsx` (avatar upload, fields), `follow-list.tsx` (searchable followers/following modal), `highlights.tsx`. Lazy-loaded `EditProfileModal` and `FollowListModal`.

---

### Prompt 14

> Improve UI/UX across the entire app.
>
> Add:
> - animations
> - loading states
> - error states
> - transitions

**Executed:** Added keyframes and utilities to `globals.css`: `animate-enter` (fade + slide up), `.stagger` (nth-child delays 0–320ms), `.card-hover`, `.press-scale`, `.loading-bar`, `.pulse-ring`. Created `components/shared/page-transition.tsx` and `error-boundary.tsx` (`ErrorDisplay` with network/generic error detection, dev details, retry button). Added `error.tsx` files for all routes. Applied `animate-enter` and `stagger` to dashboard, feed, profile, wallet pages.

---

## Operational Prompts

| # | Prompt | Action |
|---|---|---|
| O1 | How can we run the app on VS Code? | Explained `npm run dev`, VS Code terminal, localhost:3000 |
| O2 | Unable to find the API keys page on Clerk | Guided to Clerk Dashboard → API Keys, explained `.env.local` keys |
| O3 | Middleware deprecation warning in terminal | Renamed `middleware.ts` → `proxy.ts`, added public route patterns |
| O4 | Email verification `/register/verify-email-address` 404 | Created `[[...rest]]` catch-all pages under `/login` and `/register` |
| O5 | Route specificity conflict error | Deleted original `page.tsx` files conflicting with catch-all routes |
| O6 | I have added a logo.png to root dir, use it | Added to `public/logo.png`, used in Sidebar (32px) + Topbar mobile (28px), updated metadata icons, created `public/manifest.json` |
| O7 | Zap HMR error (Turbopack module corruption) | Replaced all Lucide imports in sidebar with inline SVG, removed `lucide-react` from `optimizePackageImports`, cleared `.next` via PowerShell, cleared Chrome cache |
| O8 | Hydration mismatch error | Fixed topbar href `/profile/settings` → `/profile`, cleared `.next` |
| O9 | Blank page after Clerk sign-up (Chrome only) | Root cause: stale Chrome JS bundle cache. Fixed by `Ctrl+Shift+Delete` → Clear cached files |
| O10 | How many prompts have I given you and how did you execute them? | Provided full summary of all 14 feature prompts + operational prompts |

---

## Running the App

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/feed
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/feed
```

```bash
npm run dev
# open http://localhost:3000
```

---

## Project Structure

```
SupperApp/
├── app/
│   ├── (app)/               # Protected routes
│   │   ├── layout.tsx       # Sidebar + Topbar shell
│   │   ├── feed/
│   │   ├── messages/
│   │   ├── wallet/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── search/
│   │   └── settings/
│   ├── (auth)/              # Public auth routes
│   │   ├── login/[[...rest]]/
│   │   └── register/[[...rest]]/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                  # Design system primitives
│   ├── layout/              # Sidebar, Topbar, SearchBar, NotificationPanel
│   ├── shared/              # Providers, lazy-modules, skeletons, error-boundary
│   ├── feed/
│   ├── messages/
│   ├── wallet/
│   ├── dashboard/
│   └── profile/
├── lib/
│   ├── api/                 # Typed fetch clients
│   ├── queries/             # TanStack Query hooks
│   ├── stores/              # Zustand stores
│   └── utils/
├── types/
├── public/
│   ├── logo.png
│   └── manifest.json
├── proxy.ts                 # Clerk middleware
└── next.config.ts
```

---

## Notes

- **Windows + Turbopack cache issues:** Use PowerShell `Remove-Item -Recurse -Force .next` then clear browser cache if HMR errors persist.
- **Clerk catch-all routes:** `[[...rest]]` under `/login` and `/register` is required for Clerk's multi-step flows (email verification etc).
- **Mock data:** All stores use mock data. Replace `lib/api/` fetch responses with real backend endpoints to go live.
