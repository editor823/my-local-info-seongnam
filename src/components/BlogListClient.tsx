"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostData } from "@/lib/posts";

interface Props {
  posts: PostData[];
}

export default function BlogListClient({ posts }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 전체 태그 목록 수집
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).slice(0, 10); // 상위 10개 태그

  // 검색 및 태그 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === "all" || (post.tags && post.tags.includes(selectedTag));
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. 검색창 및 태그 필터 바 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-slate-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="찾으시는 혜택 주제나 키워드를 입력하세요 (예: 청년, 장려금, 교육)"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              지우기
            </button>
          )}
        </div>

        {/* 태그 칩스 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1">태그 필터:</span>
          <button
            onClick={() => setSelectedTag("all")}
            className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
              selectedTag === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            전체 ({posts.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "all" : tag)}
              className={`text-xs px-3 py-1 rounded-lg transition-all ${
                selectedTag === tag
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 글 개수 및 상태 안내 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-500">
        <span>
          검색 결과: <strong className="text-blue-600 font-bold">{filteredPosts.length}</strong>개의 이야기
        </span>
        {(selectedTag !== "all" || searchQuery !== "") && (
          <button
            onClick={() => {
              setSelectedTag("all");
              setSearchQuery("");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            필터 초기화 ↺
          </button>
        )}
      </div>

      {/* 3. 글 카드 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm space-y-2">
          <p className="text-4xl">🔎</p>
          <h3 className="text-base font-bold text-slate-800">일치하는 글이 없습니다.</h3>
          <p className="text-xs text-slate-500">다른 키워드로 검색해 보시거나 태그를 변경해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="bg-blue-50 text-blue-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-blue-100">
                    {post.category}
                  </span>
                  <time className="text-xs text-slate-400">📅 {post.date}</time>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
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
                  className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  상세 글 읽기 &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
