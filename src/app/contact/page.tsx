import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | 성남시 우리 동네 생활 정보",
  description: "서비스 관련 제휴, 콘텐츠 오류 신고, 기타 건의 사항을 남겨주세요.",
};

export default function ContactPage() {
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
            <Link href="/about" className="hover:text-[#03c75a]">소개</Link>
            <Link href="/contact" className="text-[#03c75a] font-bold">문의하기</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-[#03c75a] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Contact Us
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            문의 및 건의하기
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            게재된 정보의 정정 요청, 행사 제보, 협업 문의 등 소중한 의견을 보내주시면 검토 후 답변드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">📧</span>
            <h3 className="font-bold text-[#0f172a] text-base">공식 문의 이메일</h3>
            <p className="text-xs text-slate-500">
              가장 빠른 피드백을 원하시는 경우 아래 이메일로 메일을 보내주세요.
            </p>
            <p className="text-sm font-extrabold text-[#03c75a] pt-2">
              contact@localinfo.kr
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="font-bold text-[#0f172a] text-base">답변 운영 시간</h3>
            <p className="text-xs text-slate-500">
              영업일 기준 24~48시간 이내에 담당자가 확인 후 회신해 드립니다.
            </p>
            <p className="text-xs text-slate-600 font-semibold pt-2">
              평일: 10:00 ~ 18:00 (주말 및 공휴일 휴무)
            </p>
          </div>
        </div>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#0f172a]">주요 문의 유형</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">1. 정보 정정 및 수정 요청</strong>
              <p className="text-xs text-slate-500">
                공고 내용의 변경, 행사 취소/연기, 지원금 마감 등 변경된 소식이 있다면 바로잡을 수 있도록 제보해 주세요.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">2. 지역 행사 제보 및 홍보 제휴</strong>
              <p className="text-xs text-slate-500">
                성남시 및 인근 지역의 축제나 공익 행사를 시민들에게 알리고 싶으신 기관 및 단체의 연락을 환영합니다.
              </p>
            </div>
          </div>
        </section>
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
            <Link href="/contact" className="hover:underline font-bold text-slate-900">문의하기</Link>
          </div>
          <p>© 2026 Seongnam Local Info. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
