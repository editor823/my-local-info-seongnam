import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://my-local-info-seongnam.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "우리 동네 이야기 - 성남 생활 정보 & 지원금 혜택 가이드",
  description: "성남 시민들을 위한 맞춤형 복지 혜택, 청년 월세, 문화 축제 및 정부 지원금 정보를 알기 쉽게 큐레이션해 드리는 생활 정보 가이드입니다.",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "우리 동네 이야기",
    title: "우리 동네 이야기 - 성남 생활 정보 & 지원금 혜택 가이드",
    description: "성남 시민들을 위한 맞춤형 복지 혜택, 청년 월세, 문화 축제 및 정부 지원금 정보 아카이브",
  },
  twitter: {
    card: "summary_large_image",
    title: "우리 동네 이야기 - 성남 생활 정보 & 지원금 혜택 가이드",
    description: "성남 시민들을 위한 맞춤형 복지 혜택, 청년 월세, 문화 축제 및 정부 지원금 정보 아카이브",
  },
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {ADSENSE_ID && (
          <>
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
              crossOrigin="anonymous"
            />
            <meta name="google-adsense-account" content={ADSENSE_ID} />
          </>
        )}
      </head>
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
