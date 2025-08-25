import type React from "react";

export default function SectionCard({
  title,
  children,
  id,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-5 md:mt-10 lg:mt-12 mb-10 md:mb-20 lg:mb-24">
      <h3 className="mb-5 md:mb-6 lg:mb-7 text-lg md:text-xl font-black">{title}</h3>
      <div className="rounded-2xl border-2 border-[var(--color-line)] bg-[var(--color-panel)]">
        {children}
      </div>
    </section>
  );
}
