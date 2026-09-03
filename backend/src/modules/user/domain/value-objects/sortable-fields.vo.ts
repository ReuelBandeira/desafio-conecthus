// Whitelisted, not a free string: an unvalidated `orderBy` gets interpolated
// into a QueryBuilder .orderBy() call, which is a query-injection vector.
export const USER_SORTABLE_FIELDS = [
  'name',
  'registration',
  'email',
  'createdAt',
  'updatedAt',
] as const;

export type UserSortableField = (typeof USER_SORTABLE_FIELDS)[number];
