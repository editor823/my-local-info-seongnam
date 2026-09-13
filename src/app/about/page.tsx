import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 소개 | 성남시 우리 동네 생활 정보",
  description: "성남 시민들을 위한 맞춤형 축제, 문화 행사, 정부 지원금 정보를 알기 쉽게 정리하여 전해드리는 생활 정보 가이드입니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-[#0f2942] hover:text-[#03c75a] transition-colors">
            📢 우리 동네 소식통
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-[#03c75a]">홈</Link>
            <Link href="/blog" className="hover:text-[#03c75a]">동네 블로그</Link>
            <Link href="/about" className="text-[#03c75a] font-bold">소개</Link>
            <Link href="/contact" className="hover:text-[#03c75a]">문의하기</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-[#03c75a] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            About Us
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            성남 생활 정보 서비스 소개
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            바쁜 일상 속에서 놓치기 쉬운 우리 동네 유용한 소식과 혜택을 한곳에 모았습니다.
          </p>
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">1. 서비스 운영 목적</h2>
          <p>
            대한민국 정부 및 성남시에서는 매달 수많은 청년 지원금, 출산·육아 혜택, 문화 예술 축제를 제공하고 있습니다. 하지만 정보가 여러 부처와 웹사이트에 흩어져 있어 제때 혜택을 받지 못하거나 행사를 놓치는 경우가 많습니다.
          </p>
          <p>
            <strong>우리 동네 소식통</strong>은 이러한 문제를 해결하기 위해 공공데이터를 기반으로 시민들에게 꼭 필요한 생활 밀착형 정보를 이해하기 쉽고 직관적으로 재가공하여 제공하고 있습니다.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">2. 데이터 출처 및 신뢰성</h2>
          <p>
            본 웹사이트에서 안내하는 모든 축제, 행사 및 지원 혜택 정보는 공공데이터포털(data.go.kr)과 정부 부처의 공식 발표 자료를 바탕으로 수집·검증 후 작성됩니다.
          </p>
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-emerald-900 space-y-1">
            <p className="font-bold">💡 알아두실 점</p>
            <p>
              지자체 및 정부 정책은 주관 기관의 사정에 따라 일정이나 세부 자격 요건이 변경될 수 있으므로, 최종 신청 전 반드시 해당 기관의 공식 안내 페이지를 다시 한번 확인해 주시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-[#0f172a]">3. 사용자 중심의 가치</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            <li><strong>한눈에 보는 일정:</strong> 복잡한 공고문 대신 핵심 날짜와 대상을 빠르게 파악할 수 있도록 돕습니다.</li>
            <li><strong>친절한 해설:</strong> 어려운 행정 용어를 일상 언어로 풀어 설명합니다.</li>
            <li><strong>투명하고 안전한 운영:</strong> 방문자의 개인정보를 소중히 여기며 관련 법령과 구글 정책을 철저히 준수합니다.</li>
          </ul>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>최종 수정일: 2026년 9월 13일</span>
          <Link href="/contact" className="text-[#03c75a] font-bold hover:underline">
            운영자에게 문의하기 →
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <div className="flex justify-center gap-4 text-xs text-slate-600">
            <Link href="/about" className="hover:underline">소개</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
            <span>|</span>
            <Link href="/terms" className="hover:underline">이용약관</Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline">문의하기</Link>
          </div>
          <p>© 2026 Seongnam Local Info. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
