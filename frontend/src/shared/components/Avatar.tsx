interface AvatarProps {
  name: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name }: AvatarProps) {
  return (
    <div
      className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-green text-xs font-bold text-white ring-2 ring-teal"
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
