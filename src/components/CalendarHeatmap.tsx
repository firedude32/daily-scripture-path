import { useAppState, todayKey } from "@/state/store";

/**
 * Calendar-style reading view. Renders the most recent `months` calendar
 * months. Each day a chapter was read shows a filled gold circle; today
 * gets a ring; other days are quiet dots on the parchment.
 */
export function CalendarHeatmap({
  months = 3,
  cell = 18,
  columns,
}: {
  months?: number;
  cell?: number;
  columns?: number;
}) {
  const state = useAppState();
  const today = new Date();
  const todayK = todayKey(today);

  const monthList: { year: number; month: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthList.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const cols = columns ?? (months >= 6 ? 3 : months);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        columnGap: 18,
        rowGap: 22,
      }}
    >
      {monthList.map((m) => (
        <MonthGrid
          key={`${m.year}-${m.month}`}
          year={m.year}
          month={m.month}
          cell={cell}
          today={today}
          todayK={todayK}
          counts={state.dailyCounts}
        />
      ))}
    </div>
  );
}

function MonthGrid({
  year,
  month,
  cell,
  today,
  todayK,
  counts,
}: {
  year: number;
  month: number;
  cell: number;
  today: Date;
  todayK: string;
  counts: Record<string, number>;
}) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = first.toLocaleDateString("en-US", { month: "long" });
  const yearLabel = year !== today.getFullYear() ? ` ${year}` : "";

  const cells: ({ day: number; key: string; read: boolean; isToday: boolean; future: boolean } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const key = todayKey(date);
    const future = date > today;
    cells.push({
      day: d,
      key,
      read: (counts[key] ?? 0) > 0,
      isToday: key === todayK,
      future,
    });
  }
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span
          className="font-display text-[color:var(--color-ink)]"
          style={{ fontSize: 14, fontWeight: 400, letterSpacing: "0.01em" }}
        >
          {monthLabel}
          <span className="text-[color:var(--color-ink-muted)]">{yearLabel}</span>
        </span>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(7, ${cell}px)`,
          gap: 4,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={`h-${i}`}
            className="font-ui text-[color:var(--color-ink-muted)] text-center"
            style={{ fontSize: 9, letterSpacing: "0.1em", lineHeight: `${cell}px` }}
          >
            {d}
          </div>
        ))}
        {cells.map((c, i) =>
          c === null ? (
            <div key={`e-${i}`} style={{ width: cell, height: cell }} />
          ) : (
            <div
              key={c.key}
              title={`${c.key}${c.read ? " · read" : ""}`}
              className="flex items-center justify-center"
              style={{ width: cell, height: cell }}
            >
              <DayDot read={c.read} isToday={c.isToday} future={c.future} size={cell} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function DayDot({
  read,
  isToday,
  future,
  size,
}: {
  read: boolean;
  isToday: boolean;
  future: boolean;
  size: number;
}) {
  const dot = Math.max(6, Math.round(size * 0.72));
  if (read) {
    return (
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: "9999px",
          background: "var(--color-gold)",
          boxShadow: isToday ? "0 0 0 1.5px var(--color-paper), 0 0 0 2.5px var(--color-ink)" : undefined,
        }}
      />
    );
  }
  if (isToday) {
    return (
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: "9999px",
          border: "1px solid var(--color-ink)",
          background: "transparent",
        }}
      />
    );
  }
  return (
    <span
      style={{
        width: Math.max(2, Math.round(size * 0.16)),
        height: Math.max(2, Math.round(size * 0.16)),
        borderRadius: "9999px",
        background: future ? "transparent" : "var(--color-rule)",
      }}
    />
  );
}
