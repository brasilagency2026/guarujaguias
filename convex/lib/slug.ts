// convex/lib/slug.ts
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // remove accents
    .replace(/[^a-z0-9\s-]/g, "")      // remove special chars
    .trim()
    .replace(/\s+/g, "-")              // spaces to dashes
    .replace(/-+/g, "-")               // collapse dashes
    .slice(0, 80);                     // max length
}
