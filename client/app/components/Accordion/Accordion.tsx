"use client";

import { PropsWithChildren, ReactNode, useId, useRef, useState } from "react";

type Props = {
  title: ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({
  title,
  defaultOpen = false,
  children,
}: PropsWithChildren<Props>) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="
          w-full hover:cursor-pointer pb-1
          text-lg lg:text-xl font-black
          text-[color:var(--color-text)] hover:text-[var(--color-brand)]
        "
      >
        <div className="flex items-center justify-between">
          <div className="text-left">{title}</div>
          <span
            className={[
              "i-lucide-chevron-down transition-transform duration-200",
              open ? "rotate-180" : "",
            ].join(" ")}
            aria-hidden
          />
        </div>
      </button>

      <div
        id={id}
        ref={panelRef}
        style={{ height: open ? panelRef.current?.scrollHeight ?? "auto" : 0 }}
        className="overflow-hidden transition-[height] duration-200"
      >
        <div>{children}</div>
      </div>
    </section>
  );
}
