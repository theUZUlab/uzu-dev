export default function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="py-6">
      <h2 className="text-[var(--text-xl)] font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
}
