import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://my-local-info-seongnam.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // 고정 정적 페이지 목록
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/events/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date("2026-09-13"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date("2026-09-13"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: new Date("2026-09-13"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: new Date("2026-09-13"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 블로그 포스트 동적 라우트 목록 (실제 발행일 반영)
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
