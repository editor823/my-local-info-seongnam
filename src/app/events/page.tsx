import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localInfoData from "../../../public/data/local-info.json";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 성남 축제 & 문화행사 캘린더 (공연·체험·플리마켓) | 우리 동네 이야기",
  description: "성남시에서 열리는 이달의 주요 축제, 문화 공연, 플리마켓, 가족 무료 체험 행사 일정을 날짜별로 한눈에 모아보세요. 공공데이터 공식 등록 정보 기반 안내.",
  alternates: {
    canonical: "/events/",
  },
};

// 날짜 파싱 헬퍼
function parseDateParts(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return { month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
  }
  return { month: 0, day: 0 };
}

export default function EventsPage() {
  const events = localInfoData.events || [];

  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "성남시 주요 축제 및 문화행사 캘린더",
    itemListElement: events.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: item.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "성남시",
            addressRegion: "경기도",
            addressCountry: "KR",
          },
        },
        description: item.summary,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 구조화 데이터 (ItemList / Event) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <Header />

      {/* 1. 상단 빵부스러기(Breadcrumb) 탐색 바 */}
      <nav aria-label="현재 위치" className="bg-white border-b border-slate-100 py-2.5 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
          <span className="text-slate-300">&gt;</span>
          <span className="text-slate-800 font-semibold">성남 축제 & 문화행사 캘린더</span>
        </div>
      </nav>

      {/* 2. 상단 배너 */}
      <section className="bg-gradient-to-b from-[#0f1d36] to-[#12284c] text-white py-14 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block bg-cyan-500/20 text-cyan-200 text-xs font-bold px-3 py-1 rounded-full border border-cyan-400/30">
            FESTIVAL & CULTURE CALENDAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            성남시 축제 & 문화행사 캘린더
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            주말 나들이부터 가족·어린이 체험, 무료 버스킹 공연까지! <br className="hidden sm:inline" />
            성남시 및 산하기관에서 공식 고시된 문화 예술 일정을 빠짐없이 안내해 드립니다.
          </p>
        </div>
      </section>

      {/* 3. 행사 목록 본문 */}
      <main className="max-w-4xl w-full mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="flex items-center justify-between pb-3 border-b-2 border-blue-600">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">🎪</span> 진행 및 예정 행사
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              공공데이터포털 기준 최신 등록된 행사 목록입니다.
            </p>
          </div>
          <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            총 {events.length}건
          </span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm space-y-2">
            <p className="text-4xl">🎪</p>
            <h3 className="text-base font-bold text-slate-800">예정된 행사가 없습니다.</h3>
            <p className="text-xs text-slate-500">곧 새로운 지역 축제 소식이 등록될 예정입니다.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {events.map((item) => {
              const { month, day } = parseDateParts(item.startDate);
              const detailHref = item.slug
                ? `/blog/${item.slug}`
                : (item.link && item.link !== "#" ? item.link : null);

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center group"
                >
                  {/* 왼쪽 날짜 박스 */}
                  <div className="w-full sm:w-28 shrink-0 bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 text-center flex sm:flex-col items-center justify-between sm:justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="text-xs font-black uppercase text-blue-600 group-hover:text-white">
                      {month}월
                    </span>
                    <strong className="text-3xl sm:text-4xl font-black text-blue-900 group-hover:text-white leading-none my-1">
                      {day}
                    </strong>
                    <span className="text-[11px] font-medium text-slate-500 group-hover:text-blue-100">
                      {item.startDate === item.endDate ? "당일 행사" : `${item.startDate.slice(5)} ~`}
                    </span>
                  </div>

                  {/* 오른쪽 상세 내용 */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-cyan-50 text-cyan-700 text-xs font-extrabold px-2.5 py-0.5 rounded-md border border-cyan-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        📍 {item.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {detailHref ? (
                        <Link href={detailHref} aria-label={`${item.title} 상세 일정 보기`}>
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>👥 참가 대상: <strong className="text-slate-700">{item.target}</strong></span>
                      {detailHref ? (
                        <Link
                          href={detailHref}
                          aria-label={`${item.title} 상세 관람 팁 및 일정 확인`}
                          className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          행사 상세 팁 보기 &gt;
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-[11px]">지자체 공식 발표 대기 중</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 4. 다른 핵심 페이지로 이어지는 크로스 추천 섹션 */}
        <section className="bg-blue-50/70 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              💰 놓치기 아까운 성남시민 전용 복지 지원금도 확인해보세요
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              청년 월세 지원부터 출산·육아 수당, 정부 근로장려금까지 한눈에 비교해 드립니다.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              혜택 차트 보기 →
            </Link>
            <Link
              href="/blog"
              className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
            >
              매거진 전체보기
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
