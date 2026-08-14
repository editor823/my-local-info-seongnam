import Link from "next/link";
import localInfoData from "../../../../public/data/local-info.json";

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
}

// 정적 내보내기(output: "export")용 모든 ID 경로 생성
export function generateStaticParams() {
  const allItems = [...localInfoData.events, ...localInfoData.benefits];
  return allItems.map((item) => ({
    id: item.id,
  }));
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // events와 benefits 합쳐서 해당 ID 항목 찾기
  const allItems: InfoItem[] = [
    ...localInfoData.events,
    ...localInfoData.benefits,
  ];
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            정보를 찾을 수 없습니다 😅
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            요청하신 행사 또는 지원금 정보가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#03c75a] hover:bg-[#02b350] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#222222] flex flex-col font-sans">
      {/* 상단 네이버 블로그 스타일 얇은 상단 바 */}
      <header className="bg-[#e8f3ff] border-b border-[#d0e5ff] py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2b72c4] hover:underline"
          >
            ← 목록으로 돌아가기
          </Link>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#03c75a] text-white">
            성남시 소식 상세
          </span>
        </div>
      </header>

      {/* 메인 상세 본문 영역 */}
      <main className="max-w-3xl w-full mx-auto px-4 py-10 flex-1">
        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e1e4e8] shadow-sm space-y-8">
          {/* 1. 카테고리 뱃지 & 크게 들어간 제목 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-md text-white ${
                isEvent ? "bg-[#2b72c4]" : "bg-[#03c75a]"
              }`}
            >
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] leading-tight tracking-tight">
              {item.title}
            </h1>
          </div>

          {/* 2. 핵심 요약 정보 박스 (기간, 장소, 대상) */}
          <div className="bg-[#f8f9fa] rounded-xl p-5 border border-slate-200/80 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="font-bold text-[#008037] shrink-0 w-16 sm:w-20">
                {isEvent ? "📅 행사 기간" : "📆 신청 기간"}
              </span>
              <span className="text-slate-800 font-semibold">
                {item.startDate === item.endDate
                  ? item.startDate
                  : `${item.startDate} ~ ${item.endDate}`}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-bold text-[#008037] shrink-0 w-16 sm:w-20">
                {isEvent ? "📍 행사 장소" : "🏛️ 신청 장소"}
              </span>
              <span className="text-slate-800 font-semibold">{item.location}</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-bold text-[#008037] shrink-0 w-16 sm:w-20">
                🎯 지원 대상
              </span>
              <span className="text-slate-800 font-extrabold text-[#005725]">
                {item.target}
              </span>
            </div>
          </div>

          {/* 3. 상세 설명 전문 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
              <span className="text-[#03c75a]">●</span> 상세 안내 내용
            </h2>
            <div className="bg-[#f0faf3] p-5 sm:p-6 rounded-xl border border-[#cbeed5] text-slate-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
              {item.summary}
            </div>
          </div>

          {/* 4. 버튼 동작 영역 (원본 사이트 링크 & 목록 돌아가기) */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#03c75a] hover:bg-[#02b350] text-white font-extrabold px-8 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              자세히 보기 →
            </a>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="bg-[#f0f2f5] border-t border-[#e2e5e9] py-8 text-center text-xs text-[#666666] mt-12">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#333333]">성남시 우리 동네 생활 정보 서비스</p>
          <p>© 2026 Seongnam Local Info. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
