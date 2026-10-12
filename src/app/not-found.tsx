import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm w-full space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 text-3xl font-black flex items-center justify-center mx-auto shadow-inner">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              요청하신 페이지가 삭제되었거나 주소가 변경되었습니다. 아래 바로가기 메뉴를 통해 원하시는 정보를 찾아보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              종합 홈으로 이동 →
            </Link>
            <Link
              href="/blog"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors"
            >
              혜택 매거진 둘러보기
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            <span>성남시 축제 일정이 궁금하신가요? </span>
            <Link href="/events" className="text-blue-600 font-semibold hover:underline">
              축제 캘린더 보기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
