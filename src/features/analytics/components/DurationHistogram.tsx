"use client";

import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

interface DurationHistogramProps {
  iterations: { totalDurationHours: number }[];
  slaTargetHours: number;
}

const BIN_COUNT = 25;

interface ChartPalette {
  bar: string;
  accent: string;
  ink: string;
  inkMuted: string;
  border: string;
  surface: string;
}

function readChartPalette(): ChartPalette {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

  return {
    bar: read("--color-brand-700", "#6b1a2b"),
    accent: read("--color-accent-ink", "#8a5c22"),
    ink: read("--color-ink", "#201013"),
    inkMuted: read("--color-ink-muted", "#5a4a4d"),
    border: read("--color-border", "#e3d9d6"),
    surface: read("--color-surface", "#ffffff"),
  };
}

function usePalette(): ChartPalette | null {
  const [palette, setPalette] = useState<ChartPalette | null>(() =>
    typeof window === "undefined" ? null : readChartPalette(),
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setPalette(readChartPalette());
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return palette;
}

export function DurationHistogram({ iterations, slaTargetHours }: DurationHistogramProps) {
  const palette = usePalette();

  const option = useMemo(() => {
    if (!palette) return null;

    const durations = iterations.map((it) => it.totalDurationHours);
    const min = durations.length ? Math.min(...durations) : 0;
    const max = durations.length ? Math.max(...durations) : 1;
    const range = max - min || 1;
    const binWidth = range / BIN_COUNT;

    const counts = new Array(BIN_COUNT).fill(0);
    for (const duration of durations) {
      const index = Math.min(BIN_COUNT - 1, Math.floor((duration - min) / binWidth));
      counts[index] += 1;
    }

    const labels = counts.map((_, index) => (min + index * binWidth).toFixed(1));

    return {
      grid: { left: 48, right: 24, top: 32, bottom: 40 },
      xAxis: {
        type: "category",
        data: labels,
        name: "Cycle time (hours)",
        nameLocation: "middle",
        nameGap: 28,
        nameTextStyle: { color: palette.inkMuted },
        axisLabel: { fontSize: 10, color: palette.inkMuted },
        axisLine: { lineStyle: { color: palette.border } },
      },
      yAxis: {
        type: "value",
        name: "Runs",
        nameTextStyle: { color: palette.inkMuted },
        axisLabel: { color: palette.inkMuted },
        splitLine: { lineStyle: { color: palette.border } },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: palette.surface,
        borderColor: palette.border,
        textStyle: { color: palette.ink },
        formatter: (params: { name: string; value: number }[]) =>
          params.length ? `${params[0].name}h &mdash; ${params[0].value} runs` : "",
      },
      series: [
        {
          type: "bar",
          data: counts,
          itemStyle: { color: palette.bar },
          barMaxWidth: 24,
          markLine: {
            symbol: "none",
            silent: true,
            lineStyle: { color: palette.accent, width: 2, type: "dashed" },
            label: { formatter: "SLA target", color: palette.accent, fontWeight: 600 },
            data: [
              {
                xAxis: Math.min(
                  BIN_COUNT - 1,
                  Math.max(0, Math.round((slaTargetHours - min) / binWidth)),
                ),
              },
            ],
          },
        },
      ],
    };
  }, [iterations, slaTargetHours, palette]);

  if (!option) {
    return <div style={{ height: 280 }} />;
  }

  return <ReactECharts option={option} style={{ height: 280, width: "100%" }} notMerge />;
}
