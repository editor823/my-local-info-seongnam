import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "성남시 생활 정보 - 우리 동네 행사 및 지원금 혜택",
  description: "성남시 축제/행사 소식부터 청년 월세, 출산지원금 등 다양한 맞춤형 혜택 정보를 한눈에 확인하세요.",
};

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
