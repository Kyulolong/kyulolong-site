"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { MAX_QUERY_LENGTH, thoughtsHref } from "@/lib/content/search";

interface ThoughtSearchProps {
  /** 지금 걸려 있는 검색어 (주소의 q, 다듬은 것) */
  query: string;
  /** 지금 걸려 있는 시리즈. 검색해도 풀리지 않게 같이 싣는다. */
  series?: string;
}

/**
 * `/thoughts` 의 검색 칸. 거르는 건 서버다 (lib/content/search.ts) — 이 칸은
 * 주소에 `?q=` 를 싣는 일만 한다.
 *
 * **평범한 GET 폼이다.** JS 가 안 떠도 엔터 한 번이면 `/thoughts?q=…` 로 가고,
 * JS 가 뜨면 그 이동을 클라이언트 전환으로 바꿔서 헤더·필터 줄이 깜빡이지 않게 할
 * 뿐이다. `next/form` 을 안 쓴 이유는 둘을 손봐야 해서다 — 앞뒤 공백을 떼고,
 * 빈 칸으로 누르면 `?q=` 를 남기는 대신 검색을 푼다.
 *
 * **치는 동안 거르지 않는다.** 한 글자마다 서버를 부르면 한글은 조합 중인
 * `평ㄱ` 으로도 한 번 찾아서 결과가 0 으로 깜빡인다. 엔터(모바일은 키보드의 검색
 * 키)로 한 번 찾는다.
 *
 * 모양은 옆의 칩과 한 식구다 — `surface-2` 면에 `rounded-badge`. 필터 줄 안의
 * 작은 컨트롤이라서다 (DESIGN.md §6 "뱃지·칩·인라인 코드·작은 컨트롤"). 인풋용
 * `rounded-note`(16px)를 32px 높이에 걸면 거의 알약이 되는데, 알약은 버튼의 것이다.
 *
 * 포커스는 형광 링이 아니라 `ink` 테두리다 (댓글 입력과 같다). 글자 칸은 마우스로
 * 눌러도 :focus-visible 이 켜져서, 링을 두면 치는 내내 화면에 형광이 한 점 더 선다.
 */
export function ThoughtSearch({ query, series }: ThoughtSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(query);

  // 주소가 바뀌면(뒤로가기·칩·지우기) 칸도 따라간다. 이펙트가 아니라 렌더 중에 맞춘다 —
  // 이펙트로 하면 한 번은 옛 값으로 그렸다가 다시 그린다 (React 문서의 "prop 이 바뀔 때 state 조정").
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = value.trim();
    if (next === query) return;
    router.push(thoughtsHref({ series, query: next }));
  }

  function clear() {
    setValue("");
    inputRef.current?.focus();
    if (query) router.push(thoughtsHref({ series }));
  }

  return (
    <form
      action="/thoughts"
      role="search"
      onSubmit={submit}
      className="relative w-full sm:w-60"
    >
      {series ? <input type="hidden" name="series" value={series} /> : null}

      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="text-ink-faint pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 md:left-3 md:size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="7" cy="7" r="4.75" />
        <path d="m10.5 10.5 3.75 3.75" />
      </svg>

      {/* text-* 를 무접두로 붙이지 않는다 — 16px 를 받아야 iOS 가 포커스에서 확대하지
          않는다 (DESIGN.md §12). md 부터는 옆 칩(13px)과 키를 맞춘다. */}
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={MAX_QUERY_LENGTH}
        placeholder="제목·본문에서 찾기"
        aria-label="글 검색"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        className="bg-surface-2 text-ink placeholder:text-ink-faint focus:border-ink rounded-badge min-h-11 w-full border border-transparent py-2 pr-11 pl-10 outline-none transition-colors md:min-h-0 md:py-1.5 md:pr-9 md:pl-8 md:text-[13px] [&::-webkit-search-cancel-button]:appearance-none"
      />

      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="검색어 지우기"
          className="text-ink-faint hover:text-ink absolute inset-y-0 right-0 flex w-11 items-center justify-center transition-colors md:w-9"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
    </form>
  );
}
