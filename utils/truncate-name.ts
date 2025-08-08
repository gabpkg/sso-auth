export function truncateName(
  name: string | null | undefined,
  truncateType?: 'normal' | 'singleName'
) {
  if (!name) return;

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0];
  }

  const first = parts[0];
  const last = parts[1];

  return (!truncateType || truncateType === 'normal') ? `${first} ${last}` : `${first}`;
};