export type MediaItem = {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  author?: string;
  authorHref?: string;
  date?: string | Date | null;
  featured?: boolean;
  tags?: MediaTag[];
};

export type MediaTag = {
  id: string;
  slug: string;
  name: string;
};

export function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("ru-RU");
}
