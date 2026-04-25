export default function DriveLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 87 78" className={className} aria-hidden>
      <path fill="#0066da" d="M6.6 66.85L10.45 73.5q1.2 2.1 3.45 3.3l13.75-23.8H0q0 2.55 1.3 4.8z" />
      <path fill="#00ac47" d="M43.65 25L29.9 1.2q-2.25 1.2-3.45 3.3L1.3 48.05Q0 50.3 0 52.95h27.65z" />
      <path fill="#ea4335" d="M73.55 76.8q2.25-1.2 3.45-3.3l1.6-2.75 7.65-13.25q1.3-2.25 1.3-4.8H59.7l5.85 11.5z" />
      <path fill="#00832d" d="M43.65 25L57.4 1.2Q55.15 0 52.55 0H34.75q-2.6 0-4.85 1.2z" />
      <path fill="#2684fc" d="M59.7 53H27.6L13.85 76.8q2.25 1.2 4.85 1.2H68.5q2.6 0 4.85-1.2z" />
      <path fill="#ffba00" d="M73.4 26.5L60.65 4.5q-1.2-2.1-3.45-3.3L43.45 25l16.25 28h27.6q0-2.55-1.3-4.8z" />
    </svg>
  );
}
