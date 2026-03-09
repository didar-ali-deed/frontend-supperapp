# Project Memory — SupperApp

## Project Description
A **Super App** frontend with 5 core modules:
1. Social Media Feed
2. Messaging
3. Payments
4. Creator Earning Dashboard
5. Profile & Settings

Production-grade, modern, component-based, scalable.

---

## Chosen Stack (2026)

| Concern              | Choice                          |
|----------------------|---------------------------------|
| Framework            | Next.js 16 (App Router)         |
| Language             | TypeScript 5.x                  |
| State — UI/Global    | Zustand 5                       |
| State — Server       | TanStack Query v5               |
| UI Library           | Custom components + Tailwind v4 |
| Icons                | Lucide React                    |
| Routing              | Next.js App Router              |
| API Integration      | Typed Axios client              |
| Auth                 | Clerk v7                        |
| Forms                | React Hook Form + Zod v4        |
| Bundler              | Turbopack (Next.js native)      |

---

## Current Architecture

### Routing Structure
```
app/
├── (auth)/                     ← Public auth group
│   ├── layout.tsx              ← Centered auth shell
│   ├── login/page.tsx          ← Clerk SignIn
│   └── register/page.tsx       ← Clerk SignUp
├── (app)/                      ← Protected app group
│   ├── layout.tsx              ← Sidebar + auth guard
│   ├── feed/page.tsx
│   ├── messages/page.tsx
│   ├── payments/page.tsx
│   ├── dashboard/page.tsx
│   └── profile/page.tsx
├── layout.tsx                  ← Root (ClerkProvider + QueryProvider)
└── page.tsx                    ← Redirects to /feed
```

### State Management
```
Zustand stores (client state):
├── useAuthStore   → user, token, role
├── useUIStore     → sidebar, theme, modals
└── useChatStore   → active conversation, unread counts

TanStack Query hooks (server state):
├── lib/hooks/feed/       useFeed, useLikePost, useCreatePost
├── lib/hooks/messaging/  useConversations, useMessages, useSendMessage
├── lib/hooks/payments/   useTransactions, usePaymentMethods, useCreatePaymentIntent
├── lib/hooks/dashboard/  useEarningsSummary, useEarningsChart, usePayouts, useRequestPayout
└── lib/hooks/profile/    useMe, useUserProfile, useUpdateProfile
```

### API Layer
```
lib/api/
├── client.ts      ← Axios instance, interceptors, typed get/post/put/patch/del
└── endpoints.ts   ← Central URL map for all 5 modules
```

---

## Full Project Tree
```
D:/SupperApp/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── feed/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── profile/page.tsx
│   ├── globals.css
│   ├── layout.tsx             ← Root layout (ClerkProvider + Providers)
│   └── page.tsx               ← Root redirect → /feed
├── components/
│   ├── ui/
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   └── index.ts
│   ├── shared/
│   │   ├── providers.tsx      ← QueryClientProvider
│   │   ├── sidebar.tsx        ← Navigation sidebar
│   │   └── topbar.tsx         ← Page header
│   ├── feed/                  ← (empty — module-specific components)
│   ├── messaging/
│   ├── payments/
│   ├── dashboard/
│   └── profile/
├── lib/
│   ├── api/
│   │   ├── client.ts          ← Typed Axios instance
│   │   ├── endpoints.ts       ← Centralised URL map
│   │   └── index.ts
│   ├── hooks/
│   │   ├── feed/useFeed.ts
│   │   ├── messaging/useMessaging.ts
│   │   ├── payments/usePayments.ts
│   │   ├── dashboard/useEarnings.ts
│   │   └── profile/useProfile.ts
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   ├── chat.store.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts              ← Tailwind class merger
│   │   ├── format.ts          ← Currency, dates, counts
│   │   └── index.ts
│   └── validations/
│       ├── auth.schema.ts     ← Zod schemas for login/register
│       ├── profile.schema.ts
│       └── index.ts
├── server/
│   ├── trpc/                  ← (empty — tRPC routers go here)
│   └── db/                    ← (empty — DB client goes here)
├── types/
│   └── index.ts               ← All TypeScript interfaces
├── styles/
├── .env.local                 ← Local env (gitignored)
├── .env.example               ← Env template
├── middleware.ts              ← Clerk edge auth
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

> Full reference: `project_memory/logs/design-system.md`

### Design Tokens (globals.css)
| Category      | Details |
|---------------|---------|
| Colors        | Neutral (12 steps), Primary/Indigo, Success/Emerald, Warning/Amber, Danger/Red |
| Semantic      | `--surface-*`, `--text-*` — automatically swap light ↔ dark |
| Typography    | 10-step scale (10px → 48px), 5 weights, 4 line-height steps |
| Spacing       | 4px base unit, 18 steps (0 → 96px) |
| Radius        | sm(4) md(8) lg(12) xl(16) 2xl(24) full |
| Shadows       | xs sm md lg xl |
| Z-index       | base raised overlay sticky modal toast |
| Animations    | fade-in, slide-up, scale-in (used for modals, toasts) |

### Component Library (`/components/ui`)
| Component | Variants / Notes |
|-----------|-----------------|
| `Button` | primary, default, destructive, outline, ghost, success, link · 8 sizes · loading, leftIcon, rightIcon |
| `Input` | leftIcon, rightIcon, error |
| `Textarea` | resize control |
| `Select` | custom chevron, placeholder |
| `Checkbox` | indeterminate, label, description, error |
| `Switch` | sm/md, label, description |
| `Form` | FormField, FormLabel, FormHint, FormError, FormSection, FormActions |
| `Card` | default, flat, outlined, interactive, primary · 4 padding sizes |
| `StatCard` | metric card with delta and icon slot |
| `Modal` | sm/md/lg/xl/full · backdrop click, Escape key, body lock |
| `ConfirmModal` | pre-built yes/no dialog |
| `Alert` | info, success, warning, danger, neutral · dismissible |
| `Badge` | 7 variants, 3 sizes, dot prop |
| `Avatar` | 7 sizes, circle/square, initials fallback |
| `AvatarGroup` | stacked with overflow count |
| `Tabs` | pill style + underline style variants |
| `Heading` | h1–h6 mapped to type scale |
| `Text` | size, weight, color variants |
| `Spinner` / `LoadingScreen` | 4 sizes |
| `Skeleton` / `SkeletonText` / `SkeletonCard` / `SkeletonAvatar` | |
| `EmptyState` | icon + title + description + action slot |
| `Divider` | horizontal, vertical, with label |

---

## Layout System (`/components/layout`)

| Component | Description |
|---|---|
| `Sidebar` | Fixed left, 256px. Logo, nav with active state + unread badge, user section. Slides in on mobile. |
| `Topbar` | Sticky, blurred bg. Hamburger (mobile), page title (desktop), SearchBar, NotificationBell, Avatar. |
| `BottomNav` | Fixed bottom, mobile only (`lg:hidden`). 5 tabs with icon + label + active state + unread badge. |
| `SearchBar` | Expands on focus, dropdown with Recent + Trending + live results. Escape/outside-click to close. |
| `NotificationPanel` | Right-side drawer. Notification rows with type icon badge, read/unread state, mark all read. |
| `NotificationBell` | Bell icon with animated unread count badge. Wired to notification store. |

### Routing (final)
| Route | Page |
|---|---|
| `/feed` | Home / Social Feed |
| `/messages` | Messaging |
| `/wallet` | Payments / Wallet |
| `/dashboard` | Creator Earning Dashboard |
| `/profile` | Profile & Settings |
| `/payments` | → redirects to `/wallet` |

### Zustand Stores (now 4)
- `useAuthStore` — user, token
- `useUIStore` — sidebar open, theme, modals
- `useChatStore` — active conversation, unread counts
- `useNotificationStore` — notifications list, panel open, read state

---

## Completed Steps
- [x] Initialized project_memory/ folder structure
- [x] Logged prompts 01–04
- [x] Defined full stack for 2026
- [x] Designed routing strategy (App Router, module layouts)
- [x] Defined state management split (Zustand + TanStack Query)
- [x] Scaffolded Next.js 16 with TypeScript + Tailwind v4
- [x] Installed all dependencies
- [x] Created environment config (.env.local + .env.example)
- [x] Built typed API client (Axios + interceptors + endpoint map)
- [x] Built Zustand stores (auth, ui, chat)
- [x] Built TanStack Query hooks for all 5 modules
- [x] Built shared components (Sidebar, Topbar, Providers)
- [x] Created auth layouts and module stub pages
- [x] Created Clerk edge middleware
- [x] Created TypeScript global types and Zod schemas
- [x] **Built complete Design System** (globals.css tokens + 20 components)
- [x] **Built main app layout** (Sidebar, Topbar, BottomNav, SearchBar, NotificationPanel)
- [x] **Added NotificationStore** (Zustand, seeded data, mark read/all, panel toggle)
- [x] **Built all 5 module pages** with real structure (Wallet, Dashboard, Profile with tabs)
- [x] Renamed Payments → Wallet with redirect
- [x] **Built Social Feed module** — PostCard, PostEditor, CommentSection, MediaPreview, FeedContainer
- [x] Infinite scroll with IntersectionObserver sentinel
- [x] Optimistic like/comment/share with useFeedStore
- [x] Lightbox for media (keyboard nav, dots, arrows)
- [x] Character counter ring, auto-resize textarea, multi-file preview strip
- [x] Mock data layer (feed.mock.ts) with paginated simulator
- [x] **Built Messaging module** — ChatList, ChatWindow, MessageBubble, MessageInput, AttachmentUploader, EmojiPicker, TypingIndicator
- [x] Split-panel layout (list + chat), full mobile single-panel navigation
- [x] Optimistic send → sent → delivered → read status progression
- [x] Simulated typing indicator + auto-reply after send
- [x] Emoji picker with 8 categories, search, quick bar
- [x] Attachment uploader with blob previews, file size labels, remove
- [x] Date separators, message grouping, avatar visibility logic
- [x] Hover reaction bar on message bubbles
- [x] Conversation context menu (pin, mute, delete), pinned section
- [x] **Built Wallet / Payments module** — WalletCard (multi-card carousel, balance toggle), TransactionList (search, filter chips, grouped by date), SendMoneyForm (3-step: recipient → amount → confirm), QRScannerUI (receive QR + scan panel), PaymentConfirmationModal (confirm → PIN → processing → success)
- [x] Wallet pages: /wallet, /wallet/send, /wallet/receive
- [x] **Built Creator Monetization Dashboard** — EarningsChart (SVG line+area, time range, hover tooltip), RevenueCard (SVG donut + legend), WithdrawPanel (balance display, quick amounts, payout method selector, confirm step, payout history), AnalyticsSummary (6 stat tiles with sparklines, audience bar chart, traffic sources), MonetizedPostsList (thumbnails, sort, filter, toggle status, rank)
- [x] Dashboard page: 3-tab layout (Overview | Monetization | Analytics)

## Pending Steps
- [ ] Build Social Feed module (PostCard, FeedList, PostComposer, CommentList)
- [ ] Build Messaging module (ConversationList, ChatWindow, MessageBubble)
- [ ] Build Payments module (TransactionList, PaymentForm, PaymentMethodCard)
- [ ] Build Creator Dashboard module (EarningsSummary, EarningsChart, PayoutHistory)
- [ ] Build Profile module (ProfileHeader, EditProfileForm, FollowerList)
- [ ] Wire Clerk auth to Zustand + API token injection
- [ ] Setup real-time socket connection
- [ ] Add error boundaries
- [ ] Write tests (Vitest + Testing Library)

- [x] **Built Profile & Settings module** — ProfileHeader (cover, avatar + camera edit, verification badge blue/gold, stats row, follow/edit buttons), FollowListModal (search, follow/unfollow per user), PostsGrid (3-col grid, lightbox with keyboard nav, hover overlay), EditProfileModal (avatar upload preview, RHF + Zod validation, all fields), AboutTab (bio, achievements, notification/privacy toggles, danger zone)
- [x] Profile store (useProfileStore) with follow state, edit modal toggle, local profile save

- [x] **Built services/ API layer** — ApiError class (status/code/details/field helpers), tokenManager, withRetry, dev request logger, safeRequest
- [x] authService (getMe, updateProfile, uploadAvatar, follow/unfollow, setToken, refreshToken, logout)
- [x] postsService (getFeed, getPost, createPost multipart, likePost, unlikePost, sharePost, getComments, addComment, deletePost)
- [x] messagesService (getConversations, getMessages, sendMessage, createConversation, markRead, deleteMessage, uploadAttachment with progress)
- [x] paymentsService (getBalance, getTransactions, getTransaction, getPaymentMethods, sendMoney, createPaymentIntent, requestPayout)
- [x] Expanded ENDPOINTS map (auth, feed.share/delete/unlike, messages.create/read/deleteMsg/attachment, payments.balance/send/payout, profile.follow/unfollow)
- [x] Enhanced auth.store — syncToken(), fetchUser(), isAuthenticated, isCreator derived flags, Clerk-safe persist
- [x] Enhanced feed.store — posts[], pagination, fetchFeed(), fetchNextPage(), createPost(), deletePost() + all optimistic UI actions
- [x] Enhanced messaging.store — fetchConversations(), markRead(), isLoadingConvs, error state
- [x] Enhanced wallet.store — fetchBalance(), fetchTransactions(), merged withdraw flow from dashboard.store
- [x] useClerkSync hook — syncs Clerk session token → tokenManager → auth store on every session change
- [x] Wired useClerkSync into Providers component

- [x] **UI Optimization (Prompt 13)** — native mobile app feel, image optimization, code splitting, memoization, skeleton loaders
  - `next.config.ts`: AVIF/WebP images, deviceSizes, 30-day cache TTL, removeConsole in production, optimizePackageImports (lucide-react, @tanstack/react-query)
  - `app/layout.tsx`: viewport export (100dvh, viewportFit:cover, themeColor), PWA manifest, Inter font swap/preload
  - `app/globals.css`: overscroll-behavior, touch-action, -webkit-tap-highlight-color, safe-area utilities (pt-safe, pb-safe, h-bottom-bar, pb-bottom-bar), scrollbar-hide, touch-target 44px, .gpu hardware-accel, snap scrolling, no-select, prefers-reduced-motion, iOS input font-size fix, .skeleton-shimmer keyframe
  - `app/(app)/layout.tsx`: h-[100dvh], overscroll-contain, pb-bottom-bar, WebkitOverflowScrolling
  - `components/layout/bottom-nav.tsx`: memo(), h-bottom-bar, safe-area paddingBottom, no-select gpu, touch-target
  - `components/shared/page-skeletons.tsx`: FeedSkeleton, MessagesSkeleton, WalletSkeleton, DashboardSkeleton, ProfileSkeleton
  - `app/(app)/*/loading.tsx`: 5 route loading files wiring skeletons into Next.js Suspense
  - `components/shared/lazy-modules.tsx`: dynamic() imports for all heavy dashboard/feed/profile components
  - Memoized: PostCard, PostCell (posts-grid), TxRow (transaction-list)
  - TypeScript fixes: SwitchProps size conflict, TextProps color conflict, Spinner duplicate export, formatFileSize missing, chat-window username pick error, message-input useRef arg, next.config turbo invalid key

- [x] **UI/UX Improvements (Prompt 14)**
  - Error boundaries: `components/shared/error-boundary.tsx` (ErrorDisplay), + 6 route `error.tsx` files (app, feed, messages, wallet, dashboard, profile)
  - Animations: `globals.css` extended with enter-from-below/left/right, bounce-in, pop keyframes; `.animate-enter`, `.animate-enter-left`, `.animate-enter-right`, `.animate-bounce-in`, `.animate-pop` utilities; `.stagger` parent class for list children delays (0–320ms); `.card-hover` lift on hover; `.press-scale` tap feedback; `.loading-bar` top progress indicator; `.pulse-ring` notification indicator
  - Skeleton upgraded from `animate-pulse-ds` to `skeleton-shimmer` (moving gradient, looks polished)
  - `components/shared/page-transition.tsx` — PageTransition wrapper component
  - Dashboard, Feed, Profile, Wallet pages wrapped with `animate-enter`; dashboard stat cards use `.stagger`
  - Dashboard page: static EarningsChart/RevenueCard/etc. imports replaced with `LazyEarningsChart` etc. from lazy-modules
  - Profile page: EditProfileModal + FollowListModal replaced with `LazyEditProfileModal` + `LazyFollowListModal`

## Next Action
**Write Vitest unit tests for services and stores, then add PWA icons.**
