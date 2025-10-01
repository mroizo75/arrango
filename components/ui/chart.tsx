"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, BarChart, Bar } from "recharts"

type ChartProps = {
  data: Array<Record<string, number | string>>
  config: {
    xKey: string
    lines?: Array<{ key: string; color: string; name?: string }>
    areas?: Array<{ key: string; color: string; name?: string; fill?: string }>
    bars?: Array<{ key: string; color: string; name?: string }>
    yLabel?: string
  }
  type?: "line" | "area" | "bar"
  height?: number
}

export function Chart({ data, config, type = "line", height = 320 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/20" />
          <XAxis dataKey={config.xKey} stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} label={config.yLabel ? { value: config.yLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: 8, border: "none" }} />
          {config.lines?.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.name}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      ) : type === "area" ? (
        <AreaChart data={data}>
          <defs>
            {config.areas?.map((area) => (
              <linearGradient id={`color-${area.key}`} key={area.key} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.fill ?? area.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={area.fill ?? area.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/20" />
          <XAxis dataKey={config.xKey} stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} label={config.yLabel ? { value: config.yLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: 8, border: "none" }} />
          {config.areas?.map((area) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              stroke={area.color}
              fillOpacity={1}
              fill={`url(#color-${area.key})`}
              name={area.name}
            />
          ))}
        </AreaChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/20" />
          <XAxis dataKey={config.xKey} stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} label={config.yLabel ? { value: config.yLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: 8, border: "none" }} />
          {config.bars?.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  )
}

