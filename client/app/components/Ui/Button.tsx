export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-line)]">
      {children}
    </button>
  );
}
