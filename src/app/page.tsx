import Link from "next/link";
import localInfoData from "../../public/data/local-info.json";

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

// 날짜 문자열에서 월과 일(숫자) 추출하는 헬퍼 함수
function parseDateParts(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return { month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
  }
  return { month: 0, day: 0 };
}

export default function Home() {
  const events: InfoItem[] = localInfoData.events;
  const benefits: InfoItem[] = localInfoData.benefits;
  const lastUpdated: string = localInfoData.lastUpdated;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#222222] flex flex-col font-sans">
      {/* 1. 네이버 블로그 스타일 상단 큰 하늘색 배너 */}
      <header className="bg-[#e8f3ff] border-b border-[#d0e5ff] py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#03c75a] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
            성남시 공식 블로그 스타일
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2942] tracking-tight mb-3">
            우리 동네 소식통 📢
          </h1>
          <p className="text-sm sm:text-lg text-[#3b6690] font-medium max-w-xl mx-auto leading-relaxed">
            성남시의 최신 행사·축제 소식과 우리 가족 맞춤 지원금 혜택을 전해드립니다.
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 (네이버 블로그의 깔끔한 중앙 정렬 카드 레이아웃) */}
      <main className="max-w-4xl w-full mx-auto px-4 py-10 flex-1 space-y-12">
        {/* 2. 행사 카드 섹션 (왼쪽: 큰 날짜 숫자 / 오른쪽: 제목, 장소, 내용) */}
        <section aria-labelledby="events-heading">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-[#03c75a]">
            <h2 id="events-heading" className="text-2xl font-bold text-[#111111] flex items-center gap-2">
              <span className="text-[#03c75a]">●</span> 이달의 주요 행사 & 축제
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full ml-auto">
              총 {events.length}건
            </span>
          </div>

          <div className="space-y-4">
            {events.map((item) => {
              const { month, day } = parseDateParts(item.startDate);
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-[#e1e4e8] shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                >
                  {/* 왼쪽: 날짜 박스 (큰 숫자 강조) */}
                  <div className="w-full sm:w-28 shrink-0 bg-[#f0f7ff] border border-[#cce3ff] rounded-lg p-3 text-center flex sm:flex-col items-center justify-between sm:justify-center">
                    <span className="text-xs font-extrabold text-[#2b72c4] uppercase">
                      {month}월
                    </span>
                    <strong className="text-3xl sm:text-4xl font-black text-[#0f4ca1] leading-none my-1">
                      {day}
                    </strong>
                    <span className="text-[11px] font-medium text-slate-500">
                      {item.startDate === item.endDate ? "당일 행사" : `${item.startDate.slice(5)} ~`}
                    </span>
                  </div>

                  {/* 오른쪽: 제목, 장소, 상세 내용 */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#2b72c4] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        📍 {item.location}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#111111] hover:text-[#2b72c4] transition-colors leading-snug">
                      <Link href={`/info/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#555555] line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>👥 대상: <strong>{item.target}</strong></span>
                      <Link
                        href={`/info/${item.id}`}
                        className="text-[#2b72c4] font-bold hover:underline inline-flex items-center gap-1 text-xs"
                      >
                        자세히 보기 &gt;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. 지원금 카드 섹션 (초록색 강조 테두리, 대상자 시각화) */}
        <section aria-labelledby="benefits-heading">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-[#03c75a]">
            <h2 id="benefits-heading" className="text-2xl font-bold text-[#111111] flex items-center gap-2">
              <span className="text-[#03c75a]">●</span> 놓치면 안 될 복지 & 지원금
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full ml-auto">
              총 {benefits.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl p-6 border-2 border-[#03c75a]/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#e6f9ed] text-[#009b43] text-xs font-extrabold px-2.5 py-1 rounded-md border border-[#b3f0c8]">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      신청: {item.startDate} ~ {item.endDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] mb-2 leading-snug">
                    <Link href={`/info/${item.id}`} className="hover:text-[#03c75a] transition-colors">
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555555] mb-4 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* 대상자 눈에 잘 띄게 초록색 강조 뱃지 영역 */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="bg-[#f0faf3] p-3 rounded-lg border border-[#cbeed5] flex items-start gap-2">
                    <span className="text-sm shrink-0">🎯</span>
                    <div>
                      <span className="text-[11px] font-bold text-[#008037] block">지원 대상자</span>
                      <strong className="text-xs sm:text-sm text-[#005725] font-extrabold">
                        {item.target}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>🏛️ {item.location}</span>
                    <Link
                      href={`/info/${item.id}`}
                      className="bg-[#03c75a] hover:bg-[#02b350] text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      상세보기 &gt;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* 4. 푸터 (네이버 블로그 하단 스타일) */}
      <footer className="bg-[#f0f2f5] border-t border-[#e2e5e9] py-8 text-center text-xs text-[#666666] mt-12">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#333333]">성남시 우리 동네 생활 정보 서비스</p>
          <p>데이터 출처: 공공데이터포털 (data.go.kr) | 마지막 업데이트: {lastUpdated}</p>
          <p className="text-slate-400">© 2026 Seongnam Local Info. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
