import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Dancing_Script, DM_Sans, Hind_Siliguri, Noto_Nastaliq_Urdu } from "next/font/google";
import AudioProvider from "@/components/AudioProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({ variable: "--font-urdu", subsets: ["arabic"], weight: ["400"] });

export const metadata: Metadata = {
  title: "For Ani, with love ✦",
  description: "A little birthday universe, made just for Ani.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Ani at 20", statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/birthday-icon.svg", apple: "/icons/birthday-icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#10162a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dancingScript.variable} ${hindSiliguri.variable} ${notoNastaliqUrdu.variable}`}>
      <body><AudioProvider>{children}</AudioProvider></body>
    </html>
  );
}
