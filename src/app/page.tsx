import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGorillaHome from "@/components/CardGorillaHome";
import localInfoData from "../../public/data/local-info.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "성남시 지원금·복지 혜택 실시간 비교 & 축제 캘린더 | 우리 동네 이야기",
  description: "성남시 청년 월세, 출산·육아 지원금, 근로장려금 실시간 인기 순위 비교 및 이달의 문화 축제 일정까지 공공데이터 기반으로 한눈에 확인하세요.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const events = localInfoData.events;
  const benefits = localInfoData.benefits;
  const lastUpdated = localInfoData.lastUpdated;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://my-local-info-seongnam.pages.dev/#website",
        "url": "https://my-local-info-seongnam.pages.dev/",
        "name": "우리 동네 이야기",
        "description": "성남시 지원금, 청년 복지, 출산 지원 및 축제 문화행사 정보 통합 큐레이션 포털",
        "inLanguage": "ko-KR",
      },
      {
        "@type": "Organization",
        "@id": "https://my-local-info-seongnam.pages.dev/#organization",
        "name": "우리 동네 이야기",
        "url": "https://my-local-info-seongnam.pages.dev/",
        "description": "성남시 공공데이터포털 기반 비공식 민간 정보 포털",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 구조화 데이터 (WebSite / Organization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 카드고릴라 스타일 상단 글로벌 내비게이션 */}
      <Header />

      {/* 2. 메인 바디 (카드고릴라 테마 레이아웃) */}
      <main className="flex-1">
        <CardGorillaHome
          events={events}
          benefits={benefits}
          lastUpdated={lastUpdated}
        />
      </main>

      {/* 3. 하단 신뢰도 푸터 및 정책 메뉴 */}
      <Footer />
    </div>
  );
}
