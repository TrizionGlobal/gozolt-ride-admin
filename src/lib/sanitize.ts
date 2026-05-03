/**
 * Strips HTML tags from input and trims whitespace.
 * Does not add any external dependencies - uses basic string operations only.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

/**
 * Sanitizes a search query by stripping HTML tags, trimming whitespace,
 * and escaping special regex characters to prevent ReDoS or unintended
 * regex behavior when used in filters.
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[.*+?^${}()|[\]\\]/g, '') // Strip special regex characters
    .trim();
}
