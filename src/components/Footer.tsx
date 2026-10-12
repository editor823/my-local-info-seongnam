import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-100/90 border-t border-slate-200 py-12 text-xs text-slate-500 mt-auto">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* 상단 사이트맵 내부링크 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-200/80 text-left">
          {/* 1. 서비스 정보 */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🏛️</span> 우리 동네 이야기
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              성남 시민을 위한 정부 지원금, 청년 복지, 축제 및 생활 편의 정보를 실시간 공공데이터를 기반으로 알기 쉽게 전달합니다.
            </p>
          </div>

          {/* 2. 핵심 서비스 바로가기 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">주요 서비스</h4>
            <nav aria-label="하단 주요 서비스 탐색" className="flex flex-col space-y-1.5 text-[11px]">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                홈 (성남시 생활 혜택 종합)
              </Link>
              <Link href="/#rankings" className="hover:text-blue-600 transition-colors">
                실시간 인기 혜택 TOP 차트
              </Link>
              <Link href="/events" className="hover:text-blue-600 transition-colors">
                성남 축제 & 문화행사 캘린더
              </Link>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                혜택 매거진 & 신청 가이드
              </Link>
            </nav>
          </div>

          {/* 3. 인기 주제 링크 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">대표 혜택 주제</h4>
            <nav aria-label="하단 대표 혜택 바로가기" className="flex flex-col space-y-1.5 text-[11px]">
              <Link href="/blog/seongnam-youth-rent-subsidy" className="hover:text-blue-600 transition-colors">
                청년 월세 한시 특별지원 안내
              </Link>
              <Link href="/blog/2026-08-15-earned-income-tax-credit" className="hover:text-blue-600 transition-colors">
                근로·자녀장려금 신청 조건
              </Link>
              <Link href="/blog/2026-08-15-preschool-tuition-support" className="hover:text-blue-600 transition-colors">
                유아학비 (누리과정) 지원 가이드
              </Link>
              <Link href="/blog/2026-10-09-seongnam-multichild-lease-loan-support" className="hover:text-blue-600 transition-colors">
                다자녀 전세자금 대출이자 지원
              </Link>
            </nav>
          </div>

          {/* 4. 고객 안내 및 정책 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">운영 및 정책</h4>
            <nav aria-label="하단 정책 메뉴" className="flex flex-col space-y-1.5 text-[11px]">
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                서비스 소개
              </Link>
              <Link href="/privacy" className="hover:text-blue-600 font-semibold text-slate-800 transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">
                이용약관 및 면책조항
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">
                문의하기 및 정보 제보
              </Link>
            </nav>
          </div>
        </div>

        {/* 하단 출처 표기 및 저작권 */}
        <div className="text-center space-y-1 text-slate-400 text-[11px] sm:text-xs">
          <p className="font-bold text-slate-700">우리 동네 이야기 · 성남시 생활 정보 큐레이션</p>
          <p>데이터 출처: 공공데이터포털(data.go.kr) 및 정부 공식 고시 자료 기반 비공식 민간 정보 포털</p>
          <p>© 2026 우리 동네 이야기. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
