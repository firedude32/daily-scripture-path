import { useAppState } from "@/state/store";
import { todayKey } from "@/state/store";

/**
 * GitHub-style heatmap. Renders `weeks` columns of 7 days ending today.
 */
export function Heatmap({ weeks = 13, cell = 14, gap = 4 }: { weeks?: number; cell?: number; gap?: number }) {
  const state = useAppState();
  const today = new Date();
  const cols: { date: string; count: number }[][] = [];

  // start from the Sunday of the week that includes "today - (weeks-1)*7" days ago
  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1));
  // align to Sunday
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
    if (count === 0) return "var(--color-heat-0)";
    if (count === 1) return "var(--color-heat-1)";
    if (count === 2) return "var(--color-heat-2)";
    if (count <= 4) return "var(--color-heat-3)";
    return "var(--color-heat-4)";
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
                borderRadius: 3,
              }}
              title={c.date ? `${c.date}: ${c.count} chapters` : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
