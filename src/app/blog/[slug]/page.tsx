import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            게시글을 찾을 수 없습니다 😅
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-slate-900 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            ← 매거진 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 빵부스러기(Breadcrumb) 바 */}
      <div className="bg-white border-b border-slate-100 py-3 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span>&gt;</span>
          <Link href="/blog" className="hover:text-emerald-600">혜택 매거진</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{post.title}</span>
        </div>
      </div>


      {/* 메인 상세 본문 */}
      <main className="max-w-3xl w-full mx-auto px-4 py-10 flex-1">
        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e1e4e8] shadow-sm space-y-6">
          {/* 머리글 정보 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-[#e8f3ff] text-[#2b72c4] text-xs font-bold px-2.5 py-0.5 rounded">
                {post.category}
              </span>
              <time className="text-xs text-slate-400">📅 {post.date}</time>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 마크다운 렌더링 본문 */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-[#2b72c4] prose-a:no-underline hover:prose-a:underline leading-relaxed text-sm sm:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 하단 뒤로가기 버튼 */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              홈(생활 정보)으로 이동
            </Link>

          </div>
        </article>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

