import { Card } from "@/components/ui/card";
import { Brain, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  summary?: any;
}

export default function ExecutiveSummaryPanel({ className, summary }: Props) {

  if (!summary) {
    return (
      <Card className={cn("p-6 h-fit", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">Waiting for AI analysis...</p>
        </div>
      </Card>
    );
  }

  const reasoning = summary.priority_analysis || {};

  const worstCaseAQI = Math.round(summary.predicted_aqi_next_24h || 0);

  return (
    <Card className={cn("p-6 h-fit", className)}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold">
            AI Executive Summary
          </h2>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Worst Case (24h)
          </p>
          <p className="text-2xl font-bold">
            {worstCaseAQI}
          </p>
        </div>

      </div>

      {/* METRICS */}

      <div className="grid grid-cols-4 gap-4 mb-4">

        <Metric
          label="Dominant Pollutant"
          value={summary.dominant_pollutant || "N/A"}
        />

        <Metric
          label="Risk Level"
          value={reasoning.risk_level || "Unknown"}
        />

        <Metric
          label="AQI Trend"
          value={reasoning.aqi_trend || "Unknown"}
        />

        <Metric
          label="Priority Pollutant"
          value={reasoning.priority_pollutant || "N/A"}
        />

      </div>

      {/* ALERT */}

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-xs">

        <span className="font-semibold text-destructive">
          Critical:
        </span>{" "}
        {summary.dominant_pollutant || "Pollutant"} may influence AQI levels in the next 24 hours.

      </div>

    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {

  return (
    <div className="bg-muted/40 p-3 rounded-lg">

      <p className="text-[11px] text-muted-foreground mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}