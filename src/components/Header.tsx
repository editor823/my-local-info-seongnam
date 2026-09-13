import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.06)]">
      {/* 1. 최상단 서브 바 */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>성남시 공공데이터 및 복지 혜택 실시간 통합 아카이브</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">서비스 소개</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">문의/제보</Link>
          </div>
        </div>
      </div>

      {/* 2. 메인 로고 및 핵심 GNB 메뉴 */}
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                성남<span className="text-blue-600">고릴라</span>
                <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full">Local</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-1">
                스마트한 우리 동네 생활 정보 큐레이션
              </p>
            </div>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-slate-700">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50/80 transition-colors"
            >
              종합 홈
            </Link>
            <Link
              href="/#rankings"
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-blue-500">🏆</span> 인기 혜택 TOP
            </Link>
            <Link
              href="/#events"
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50/80 transition-colors"
            >
              축제 & 문화행사
            </Link>
            <Link
              href="/blog"
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-sky-500">✍️</span> 혜택 매거진
            </Link>
          </nav>
        </div>

        {/* 우측 바로가기 배너 버튼 */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-extrabold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>전체 혜택 보기</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
