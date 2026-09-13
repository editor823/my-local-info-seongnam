"use client";

import { useState } from "react";
import Link from "next/link";

interface InfoItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  slug?: string;
  name?: string;
}

interface Props {
  events: InfoItem[];
  benefits: InfoItem[];
  lastUpdated: string;
}

export default function CardGorillaHome({ events, benefits, lastUpdated }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "benefit" | "event">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링 처리 (title, name, summary, target, location, category 모두 포괄적 검색)
  const allItems = [
    ...benefits.map((b) => ({ ...b, type: "benefit" as const })),
    ...events.map((e) => ({ ...e, type: "event" as const })),
  ];

  const term = searchTerm.trim().toLowerCase();

  const filteredItems = allItems.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "benefit" && item.type === "benefit") ||
      (activeTab === "event" && item.type === "event");

    if (!matchesTab) return false;
    if (!term) return true;

    const titleMatch = (item.title || "").toLowerCase().includes(term);
    const nameMatch = (item.name || "").toLowerCase().includes(term);
    const summaryMatch = (item.summary || "").toLowerCase().includes(term);
    const targetMatch = (item.target || "").toLowerCase().includes(term);
    const locationMatch = (item.location || "").toLowerCase().includes(term);
    const categoryMatch = (item.category || "").toLowerCase().includes(term);

    return titleMatch || nameMatch || summaryMatch || targetMatch || locationMatch || categoryMatch;
  });

  // 검색 시 목록 영역으로 부드럽게 스크롤 이동
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEl = document.getElementById("content-list");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    const targetEl = document.getElementById("content-list");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. 상단 히어로 섹션 (시원하고 깊이감 있는 딥블루 & 스카이블루 그라데이션) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1d36] via-[#12284c] to-[#0a1526] text-white py-14 sm:py-20 px-4">
        {/* 장식용 시원한 블루 글로우 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-35">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[130px]"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-sky-400 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 text-sky-200 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>2026 성남시민을 위한 실시간 생활 혜택 차트</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            놓치면 후회하는 <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-cyan-300">
              우리 동네 알짜 혜택
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            내가 받을 수 있는 정부 지원금, 청년 월세, 지자체 축제 소식까지! <br className="hidden sm:inline" />
            공공데이터를 기반으로 실시간 가장 인기 있는 소식을 큐레이션해 드립니다.
          </p>

          {/* 깔끔한 검색바 (form 태그로 엔터키 및 검색 버튼 완벽 지원) */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 sm:p-2.5 border border-blue-100">
              <span className="text-xl sm:text-2xl px-3 text-blue-500">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="관심있는 혜택, 행사, 대상(청년, 유아, 출산)을 검색해보세요"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
                >
                  지우기
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shrink-0 shadow-md shadow-blue-500/20"
              >
                검색
              </button>
            </form>

            {/* 빠른 추천 키워드 태그 */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-bold text-sky-200">추천 태그:</span>
              {["청년 월세", "근로장려금", "출산지원금", "봄꽃 축제", "유아학비"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-800/80 hover:bg-blue-900/60 hover:border-blue-400/50 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 인기 혜택 TOP 랭킹 보드 */}
      <section id="rankings" className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              <span>REAL-TIME CHART</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-slate-400 font-normal">기준: {lastUpdated}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
              🏆 성남 시민 주목도 TOP 차트
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            신청 마감 임박 및 조회수가 가장 높은 대표 혜택 순위입니다.
          </p>
        </div>

        {/* 랭킹 1위~3위 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.slice(0, 3).map((item, idx) => {
            const detailHref = item.slug ? `/blog/${item.slug}` : "/blog";
            const rankBadges = [
              "bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-blue-500/30",
              "bg-gradient-to-tr from-slate-600 to-slate-400 text-white shadow-slate-500/30",
              "bg-gradient-to-tr from-cyan-700 to-cyan-500 text-white shadow-cyan-600/30",
            ];

            return (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* 랭킹 배지 */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-9 h-9 rounded-xl ${rankBadges[idx]} font-black text-base flex items-center justify-center shadow-md`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* 카드 본문 */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    <Link href={detailHref}>{item.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* 하단 스펙 요약 */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>지원 대상</span>
                      <strong className="text-slate-800 font-semibold truncate max-w-[160px]">{item.target}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>접수 기관</span>
                      <span className="text-slate-700">{item.location}</span>
                    </div>
                  </div>

                  <Link
                    href={detailHref}
                    className="block text-center w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    상세 혜택 분석 보기 →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 메인 콘텐츠 탭 & 리스트 뷰 (id="content-list" 추가로 검색 시 자동 스크롤) */}
      <section id="content-list" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        {/* 상단 탭 전환 바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              전체 생활 정보 & 혜택 모아보기
              {searchTerm && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                  &apos;{searchTerm}&apos; 검색 결과 ({filteredItems.length}건)
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              분야별 맞춤 필터를 통해 필요한 소식을 빠르게 찾아보세요.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl font-bold text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              전체보기 ({allItems.length})
            </button>
            <button
              onClick={() => setActiveTab("benefit")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "benefit"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              지원금 & 복지 ({benefits.length})
            </button>
            <button
              onClick={() => setActiveTab("event")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "event"
                  ? "bg-white text-cyan-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              축제 & 행사 ({events.length})
            </button>
          </div>
        </div>

        {/* 결과 리스트 */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
            <span className="text-4xl">🔎</span>
            <p className="font-bold text-slate-700">&apos;{searchTerm}&apos;에 대한 검색 결과가 없습니다.</p>
            <p className="text-xs">다른 검색어로 검색하시거나 필터 탭을 변경해 보세요.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
              }}
              className="inline-block mt-2 bg-blue-50 text-blue-600 font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              검색 초기화
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => {
              const detailHref = item.slug ? `/blog/${item.slug}` : "/blog";
              const isEvent = item.type === "event";

              return (
                <article
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between group"
                >
                  {/* 왼쪽 아이콘 및 기본 정보 */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-xl shadow-inner ${
                        isEvent
                          ? "bg-cyan-50 text-cyan-600 border border-cyan-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {isEvent ? "🎪" : "💰"}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            isEvent
                              ? "bg-cyan-100/70 text-cyan-800"
                              : "bg-blue-100/70 text-blue-800"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          기간: {item.startDate} ~ {item.endDate}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-medium">
                          📍 {item.location}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        <Link href={detailHref}>{item.title}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* 오른쪽 대상 뱃지 및 액션 버튼 */}
                  <div className="w-full md:w-auto shrink-0 flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">지원 대상</span>
                      <strong className="text-xs font-bold text-slate-700 truncate max-w-[200px] block">
                        {item.target}
                      </strong>
                    </div>

                    <Link
                      href={detailHref}
                      className="inline-flex items-center gap-1.5 bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
                    >
                      <span>자세히 보기</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. 시원한 블루톤 매거진 배너 섹션 */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/15">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
              꿀팁 매거진
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              지원금 신청 서류 준비, 한 번에 끝내는 법!
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-lg">
              신청 자격부터 필수 구비 서류, 주민센터 방문 팁까지 상세 가이드 글에서 확인해 보세요.
            </p>
          </div>

          <Link
            href="/blog"
            className="bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            매거진 아티클 읽기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
