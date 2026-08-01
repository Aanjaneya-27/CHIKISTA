export function daysBetween(startStr, endStr) {
  if (!startStr) return null;
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date();
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}