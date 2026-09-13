import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <div className="bg-slate-900 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            LOCAL MAGAZINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            성남 혜택 & 생활 팁 매거진
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            전문 에디터가 정리한 신청 꿀팁과 놓치면 안 될 복지 소식을 만나보세요.
          </p>
        </div>
      </div>

      {/* 2. 블로그 목록 메인 본문 */}
      <main className="max-w-4xl w-full mx-auto px-4 py-10 flex-1 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#03c75a]">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] flex items-center gap-2">
            <span className="text-[#03c75a]">●</span> 최신 포스트 목록
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
            총 {posts.length}편
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#e1e4e8] text-center shadow-sm">
            <p className="text-4xl mb-3">📝</p>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              등록된 블로그 글이 아직 없습니다.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              곧 새롭고 유익한 동네 소식이 등록될 예정입니다!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl p-6 border border-[#e1e4e8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="bg-[#e8f3ff] text-[#2b72c4] text-xs font-bold px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                    <time className="text-xs text-slate-400 font-medium">
                      📅 {post.date}
                    </time>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#03c75a] transition-colors leading-snug mb-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#555555] line-clamp-2 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#03c75a] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    글 읽기 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 3. 하단 푸터 */}
      <Footer />
    </div>
  );
}

