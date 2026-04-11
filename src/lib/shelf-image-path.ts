export function shelfImagePath(location: string): string {
  if (!location) return "";
  const normalized = location.toLowerCase().replace(/\s+/g, "-");
  // Split: everything before the last dash is the section, after is the number
  const lastDash = normalized.lastIndexOf("-");
  if (lastDash === -1) return "";
  const section = normalized.substring(0, lastDash);
  const number = normalized.substring(lastDash + 1);
  return `/shelf-images/${section}/${section}-${number}.jpg`;
}

/** Parse a shelf location into its section name and image number. */
export function parseShelfLocation(location: string): {
  section: string;
  number: number;
} | null {
  if (!location) return null;
  const normalized = location.toLowerCase().replace(/\s+/g, "-");
  const lastDash = normalized.lastIndexOf("-");
  if (lastDash === -1) return null;
  const section = normalized.substring(0, lastDash);
  const num = parseInt(normalized.substring(lastDash + 1), 10);
  if (isNaN(num)) return null;
  return { section, number: num };
}

/** Build a shelf image path from section name and number directly. */
export function shelfImagePathFromParts(
  section: string,
  number: number
): string {
  return `/shelf-images/${section}/${section}-${number}.jpg`;
}
