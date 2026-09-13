import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localInfoData from "../../../public/data/local-info.json";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "축제 & 문화행사 소식 | 우리 동네 이야기",
  description: "성남시에서 열리는 이달의 주요 축제, 문화 공연, 플리마켓, 가족 체험 행사 일정을 한눈에 모아보세요.",
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      {/* 1. 상단 배너 */}
      <section className="bg-gradient-to-b from-[#0f1d36] to-[#12284c] text-white py-14 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block bg-cyan-500/20 text-cyan-200 text-xs font-bold px-3 py-1 rounded-full border border-cyan-400/30">
            FESTIVAL & CULTURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            성남 축제 & 문화행사 캘린더
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            가족, 친구, 연인과 함께 즐길 수 있는 성남시의 활기찬 축제 소식과 문화 예술 공연 일정을 놓치지 마세요!
          </p>
        </div>
      </section>

      {/* 2. 행사 목록 본문 */}
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
              const detailHref = item.slug ? `/blog/${item.slug}` : "/blog";

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
                      <Link href={detailHref}>{item.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>👥 참가 대상: <strong className="text-slate-700">{item.target}</strong></span>
                      <Link
                        href={detailHref}
                        className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        행사 상세 팁 보기 &gt;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
