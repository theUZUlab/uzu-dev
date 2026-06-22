"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-screen-2xl 2xl:max-w-[1440px] px-4 lg:px-8 2xl:px-10 py-6 md:py-7 lg:py-8">
      <p className="text-[var(--color-muted)] mt-6 md:mt-7 lg:mt-8">
        콘텐츠를 불러오지 못했습니다.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 text-sm text-[var(--color-brand)] hover:underline"
      >
        다시 시도
      </button>
    </main>
  );
}
