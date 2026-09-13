import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "우리 동네 이야기 - 성남 생활 정보 & 지원금 혜택 가이드",
  description: "성남 시민들을 위한 맞춤형 복지 혜택, 청년 월세, 문화 축제 및 정부 지원금 정보를 알기 쉽게 큐레이션해 드리는 생활 정보 가이드입니다.",
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
