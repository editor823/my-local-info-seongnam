import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "동네 소식 블로그 - 성남시 생활 정보",
  description: "성남시의 유용한 생활 소식, 축제 팁, 혜택 안내 블로그 글을 만나보세요.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#222222] flex flex-col font-sans">
      {/* 1. 상단 네비게이션 헤더 */}
      <header className="bg-[#e8f3ff] border-b border-[#d0e5ff] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Link href="/" className="text-xs text-slate-500 hover:underline">
                홈으로
              </Link>
              <span className="text-xs text-slate-400">&gt;</span>
              <span className="text-xs font-bold text-[#03c75a]">동네 블로그</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0f2942] tracking-tight">
              우리 동네 소식 블로그 ✍️
            </h1>
            <p className="text-xs sm:text-sm text-[#3b6690] mt-1">
              생활 정보부터 지원금 혜택까지 유익한 이야기를 전해드립니다.
            </p>
          </div>

          {/* 네비게이션 링크 */}
          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-4 py-2 rounded-lg border border-[#cce3ff] transition-colors"
            >
              생활 정보 홈
            </Link>
            <Link
              href="/blog"
              className="bg-[#03c75a] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

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
      <footer className="bg-[#f0f2f5] border-t border-[#e2e5e9] py-8 text-center text-xs text-[#666666] mt-12">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#333333]">성남시 우리 동네 생활 정보 서비스</p>
          <p>© 2026 Seongnam Local Info. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
