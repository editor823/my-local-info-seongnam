import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-100/80 border-t border-slate-200 py-10 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {/* 정책 및 안내 메뉴 링크 */}
        <nav aria-label="하단 정책 메뉴" className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 font-medium text-slate-600">
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            서비스 소개
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy" className="hover:text-blue-600 font-semibold text-slate-800 transition-colors">
            개인정보처리방침
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">
            이용약관 및 면책조항
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            문의하기
          </Link>
        </nav>

        <div className="space-y-1 text-slate-400 text-[11px] sm:text-xs">
          <p className="font-bold text-slate-700">우리 동네 이야기 · 성남시 생활 정보 큐레이션</p>
          <p>데이터 출처: 공공데이터포털(data.go.kr) 및 정부 공식 고시 자료 기반</p>
          <p>© 2026 우리 동네 이야기. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
