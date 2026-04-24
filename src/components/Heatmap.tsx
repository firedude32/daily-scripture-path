import { useAppState, todayKey } from "@/state/store";

/**
 * GitHub-style heatmap. Renders `weeks` columns of 7 days ending today.
 * Cells are Gold at 30/50/75/100% opacity over Rule for empty days.
 * Sharp 2px squares, 2px gap, no rounding — editorial.
 */
export function Heatmap({
  weeks = 13,
  cell = 14,
  gap = 2,
}: {
  weeks?: number;
  cell?: number;
  gap?: number;
}) {
  const state = useAppState();
  const today = new Date();
  const cols: { date: string; count: number }[][] = [];

  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1));
  while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

  for (let w = 0; w < weeks; w++) {
    const col: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      if (day > today) {
        col.push({ date: "", count: -1 });
      } else {
        const key = todayKey(day);
        col.push({ date: key, count: state.dailyCounts[key] ?? 0 });
      }
    }
    cols.push(col);
  }

  function color(count: number): string {
    if (count < 0) return "transparent";
    if (count === 0) return "var(--color-rule)";
    if (count === 1) return "rgba(184, 134, 11, 0.30)";
    if (count === 2) return "rgba(184, 134, 11, 0.50)";
    if (count <= 4) return "rgba(184, 134, 11, 0.75)";
    return "var(--color-gold)";
  }

  return (
    <div className="flex" style={{ gap }}>
      {cols.map((col, i) => (
        <div key={i} className="flex flex-col" style={{ gap }}>
          {col.map((c, j) => (
            <div
              key={j}
              style={{
                width: cell,
                height: cell,
                background: color(c.count),
              }}
              title={c.date ? `${c.date}: ${c.count} chapter${c.count === 1 ? "" : "s"}` : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
