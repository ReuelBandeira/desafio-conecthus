interface LogoProps {
  className?: string;
}

// Logo vetorial exportado direto do Adobe XD (imagens-docs/telahome/Group
// 48687.svg) — não é mais texto recriado com CSS, é o traçado real.
export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/wenlock-logo.svg"
      alt="WenLock"
      className={className}
      style={{ height: '1.5rem', width: 'auto' }}
    />
  );
}
