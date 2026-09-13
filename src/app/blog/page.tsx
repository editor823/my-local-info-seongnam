import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogListClient from "@/components/BlogListClient";

export const metadata = {
  title: "혜택 매거진 & 블로그 | 우리 동네 이야기",
  description: "성남시 지원금 신청 가이드, 축제 후기 및 알짜 생활 팁을 전해드리는 정보 매거진입니다.",
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
            우리 동네 이야기 & 혜택 매거진
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            전문 에디터가 정리한 신청 꿀팁과 놓치면 안 될 복지 소식을 만나보세요.
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
