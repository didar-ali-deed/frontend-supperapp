import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

/* ── Font ────────────────────────────────────────────────────── */
const inter = Inter({
  subsets:   ["latin"],
  variable:  "--font-inter",
  display:   "swap",           // show fallback font immediately
  preload:   true,
  // Only load the weights we actually use
  weight:    ["400", "500", "600", "700"],
});

/* ── Metadata ────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  "SupperApp",
    template: "%s | SupperApp",
  },
  description:
    "The super app — social, messaging, payments, and creator tools in one.",
  applicationName: "SupperApp",
  keywords:        ["social", "messaging", "payments", "creator", "dashboard"],
  authors:         [{ name: "SupperApp Team" }],

  // Favicon + icons
  icons: {
    icon:  "/logo.png",
    apple: "/logo.png",
  },

  // PWA manifest
  manifest: "/manifest.json",

  // iOS web-app appearance
  appleWebApp: {
    capable:          true,
    statusBarStyle:   "black-translucent",
    title:            "SupperApp",
  },

  // Open Graph
  openGraph: {
    type:        "website",
    siteName:    "SupperApp",
    title:       "SupperApp",
    description: "The super app — social, messaging, payments, and creator tools.",
  },

  // Prevent automatic phone number detection
  formatDetection: {
    telephone: false,
    address:   false,
    email:     false,
  },
};

/* ── Viewport ────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width:              "device-width",
  initialScale:       1,
  minimumScale:       1,
  // Prevent iOS from zooming on input focus
  maximumScale:       1,
  userScalable:       false,
  // Extend behind the iPhone notch / home-bar
  viewportFit:        "cover",
  themeColor:         [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

/* ── Layout ──────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
