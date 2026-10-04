import type { CSSProperties } from "react";
import { FileUser, Gauge, Landmark, LineChart, Package, Percent, Scale, Target, TrendingDown } from "lucide-react";
import type { ToolMeta } from "@/data/tools";

const ICONS = { TrendingDown, LineChart, Landmark, Target, Package, Gauge, Scale, Percent, FileUser };

export default function ToolIcon({ name, className, style }: { name: ToolMeta["icon"] | "FileUser"; className?: string; style?: CSSProperties }) {
  const Icon = ICONS[name];
  return <Icon className={className} style={style} aria-hidden />;
}
