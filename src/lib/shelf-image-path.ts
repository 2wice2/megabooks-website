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
