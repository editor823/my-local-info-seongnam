import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogListClient from "@/components/BlogListClient";

export const metadata = {
  title: "성남 복지 지원금 & 생활 정보 매거진 | 우리 동네 이야기",
  description: "성남시 청년 주거비, 육아 수당, 정부 근로·자녀장려금 등 실제 받을 수 있는 복지 혜택의 자격 요건과 온라인 신청 팁을 알기 쉽게 해설해 드립니다.",
  alternates: {
    canonical: "/blog/",
  },
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 배너 */}
      <div className="bg-gradient-to-b from-[#0f1d36] to-[#12284c] text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="inline-block bg-blue-500/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
            STORY & MAGAZINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            성남 생활 복지 & 혜택 매거진
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            공공데이터 공식 정책을 바탕으로 복잡한 지원 자격, 제출 서류, 온라인 신청 팁을 알기 쉽게 정리해 드립니다.
          </p>
        </div>
      </div>

      {/* 3. 블로그 검색/필터 및 목록 인터랙티브 본문 */}
      <main className="max-w-4xl w-full mx-auto px-4 py-10 flex-1">
        <BlogListClient posts={posts} />
      </main>

      {/* 4. 하단 푸터 */}
      <Footer />
    </div>
  );
}
