export function parseShelfLocation(location: string): { section: string; number: number; label: string } | null {
  if (!location) return null;
  const normalized = location.toLowerCase().replace(/\s+/g, "-");
  const lastDash = normalized.lastIndexOf("-");
  if (lastDash === -1) return null;
  const section = normalized.substring(0, lastDash);
  const number = parseInt(normalized.substring(lastDash + 1), 10);
  if (isNaN(number)) return null;
  // Original label without the number (e.g. "English novels")
  const label = location.replace(/\s*\d+\s*$/, "");
  return { section, number, label };
}

export function shelfImagePath(location: string): string {
  const parsed = parseShelfLocation(location);
  if (!parsed) return "";
  return `/shelf-images/${parsed.section}/${parsed.section}-${parsed.number}.jpg`;
}
