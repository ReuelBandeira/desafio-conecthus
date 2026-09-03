// Ícones traçados a partir dos SVGs exportados do Adobe XD
// (imagens-docs/telahome/*.svg), recoloridos via `currentColor` — ao
// contrário de um <img>, herdam a cor do texto em cada estado (ativo/
// inativo) do jeito que o design pede.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.984,8.241c0,1.533-.018,3.067.016,4.6a1.386,1.386,0,0,0,.355.859c1.98,2.017,3.987,4.008,5.984,6.007.587.588.556.878-.137,1.347A10.028,10.028,0,1,1,8.954,2.786c.751-.149,1.026.075,1.029.855,0,1.534,0,3.067,0,4.6" />
      <path d="M12.121,11.278c-.014-.241-.033-.42-.033-.6q0-4.184,0-8.369c0-.821.218-1.031,1.015-1a9.322,9.322,0,0,1,8.85,8.075,10.178,10.178,0,0,1,.1,1.156.643.643,0,0,1-.7.737c-3.048,0-6.1,0-9.222,0" />
      <path d="M12.887,13.393c.277-.015.452-.033.627-.034q4.3,0,8.59,0a5.345,5.345,0,0,1,.607.037.58.58,0,0,1,.575.721,9.447,9.447,0,0,1-3.068,5.858c-.383.348-.7.116-1-.186q-2.971-2.984-5.953-5.96c-.112-.111-.207-.239-.376-.437" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.987,22.785q-3.995,0-7.99,0a1.292,1.292,0,0,1-1.423-1.56,7.237,7.237,0,0,1,6.346-7A18.276,18.276,0,0,1,16,14.4a7.335,7.335,0,0,1,5.427,7.029,1.251,1.251,0,0,1-1.393,1.351q-4.026,0-8.052,0M4.591,20.8H19.367a1.535,1.535,0,0,0,.014-.279,5.462,5.462,0,0,0-5.034-4.451c-1.434-.025-2.868.009-4.3-.01a5.3,5.3,0,0,0-4.323,2.083A4.849,4.849,0,0,0,4.591,20.8" />
      <path d="M17.33,6.647a5.284,5.284,0,0,1-5.352,5.317A5.349,5.349,0,0,1,6.634,6.55a5.4,5.4,0,0,1,5.382-5.335A5.349,5.349,0,0,1,17.33,6.647m-5.342,3.38a3.474,3.474,0,0,0,3.437-3.445,3.428,3.428,0,0,0-6.856.039,3.484,3.484,0,0,0,3.419,3.406" />
    </svg>
  );
}

export function AccessControlIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3.986,12.018q0-3.865,0-7.73a2.728,2.728,0,0,1,2.947-2.97q5.052-.007,10.1,0A2.71,2.71,0,0,1,20,4.212Q20.03,12,20,19.792a2.679,2.679,0,0,1-2.948,2.892H6.887a2.688,2.688,0,0,1-2.9-2.876c-.006-2.6,0-5.194,0-7.79M12,18.752c1.258,0,2.516.007,3.773,0,.772,0,1.007-.286.925-1.061a3.258,3.258,0,0,0-3.249-3.011c-.871-.022-1.744-.008-2.616-.005A3.272,3.272,0,0,0,7.3,17.645c-.133.778.128,1.1.926,1.1,1.258.009,2.516,0,3.773,0m-.051-5.388a2.694,2.694,0,1,0-2.655-2.68,2.678,2.678,0,0,0,2.655,2.68m.071-9.41c-.648,0-1.3,0-1.945,0-.417,0-.72.144-.768.6a.638.638,0,0,0,.637.793c1.376.028,2.753.022,4.128-.008a.626.626,0,0,0,.627-.743c-.025-.453-.315-.631-.734-.635-.648-.006-1.3,0-1.945,0" />
    </svg>
  );
}

export function ViewIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M2.5 12s3.6-7 9.5-7 9.5 7 9.5 7-3.6 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="m4 16.5 10.2-10.2a1.5 1.5 0 0 1 2.1 0l1.4 1.4a1.5 1.5 0 0 1 0 2.1L7.5 20H4z" />
      <path d="m13 7.5 3.5 3.5" />
    </svg>
  );
}

export function DeleteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7h10l-.8 12.2A1.5 1.5 0 0 1 14.7 20.5H9.3a1.5 1.5 0 0 1-1.5-1.3L7 7Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 9 9" fill="currentColor" {...props}>
      <path d="M2.45 1.2 6.3 4.5 2.45 7.8" />
    </svg>
  );
}

/** Check do toast de sucesso (Adobe XD Group 47774). */
export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.745,19.878a1.5,1.5,0,0,1-1.016-.4L1.811,13.116a1.5,1.5,0,1,1,2.031-2.207l5.8,5.336L20.056,4.621a1.5,1.5,0,0,1,2.234,2L10.862,19.379a1.5,1.5,0,0,1-1.045.5l-.072,0" />
    </svg>
  );
}
