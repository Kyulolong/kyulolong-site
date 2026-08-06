import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  serviceFrontmatterSchema,
  videoFrontmatterSchema,
  type Service,
  type Video,
} from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const SERVICES_DIR = path.join(CONTENT_DIR, "services");
const VIDEOS_DIR = path.join(CONTENT_DIR, "videos");

/** 스키마 위반을 파일 단위로 모아서 한 번에 보고하기 위한 에러 */
export class ContentError extends Error {
  constructor(public readonly problems: string[]) {
    super(
      `콘텐츠 검증 실패 (${problems.length}건)\n\n` +
        problems.map((p) => `  • ${p}`).join("\n") +
        "\n",
    );
    this.name = "ContentError";
  }
}

/**
 * YAML 은 `publishedAt: 2026-07-15` 를 Date 객체로 파싱한다.
 * 스키마는 YYYY-MM-DD 문자열을 기대하므로 여기서 맞춰준다.
 */
function normalizeDates(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] =
      value instanceof Date ? value.toISOString().slice(0, 10) : value;
  }
  return out;
}

function formatIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const at = issue.path.length ? issue.path.join(".") : "(최상위)";
    return `${file} — ${at}: ${issue.message}`;
  });
}

function readCollection<T extends z.ZodType>(
  dir: string,
  schema: T,
  label: string,
): { slug: string; data: z.infer<T>; body: string }[] {
  if (!fs.existsSync(dir)) {
    throw new ContentError([
      `${label} 디렉토리가 없습니다: ${path.relative(process.cwd(), dir)}`,
    ]);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const problems: string[] = [];
  const entries: { slug: string; data: z.infer<T>; body: string }[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const parsed = schema.safeParse(normalizeDates(data));
    if (!parsed.success) {
      problems.push(...formatIssues(`${label}/${file}`, parsed.error));
      continue;
    }

    entries.push({ slug, data: parsed.data, body: content.trim() });
  }

  if (problems.length) throw new ContentError(problems);
  return entries;
}

/**
 * 스펙 5번의 기본 정렬: featured 를 상단 고정하고 그 안에서 최신순.
 * publishedAt 이 YYYY-MM-DD 라 문자열 비교로 날짜순이 맞는다.
 */
function byFeaturedThenRecent<T extends { featured?: boolean; publishedAt: string; slug: string }>(
  a: T,
  b: T,
): number {
  if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
  if (a.publishedAt !== b.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
  return a.slug.localeCompare(b.slug);
}

// 빌드 한 번에 파일을 여러 번 읽지 않도록 캐시한다.
let servicesCache: Service[] | null = null;
let videosCache: Video[] | null = null;

export function getServices(): Service[] {
  if (!servicesCache) {
    servicesCache = readCollection(SERVICES_DIR, serviceFrontmatterSchema, "services")
      .map(({ slug, data, body }) => ({ slug, ...data, body }))
      .sort(byFeaturedThenRecent);
  }
  return servicesCache;
}

export function getVideos(): Video[] {
  if (!videosCache) {
    videosCache = readCollection(VIDEOS_DIR, videoFrontmatterSchema, "videos")
      .map(({ slug, data, body }) => ({ slug, ...data, body }))
      .sort(byFeaturedThenRecent);
  }
  return videosCache;
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function getVideo(slug: string): Video | undefined {
  return getVideos().find((v) => v.slug === slug);
}

/** 테스트/검증 스크립트가 캐시를 비우고 다시 읽을 때 쓴다. */
export function clearContentCache(): void {
  servicesCache = null;
  videosCache = null;
}
