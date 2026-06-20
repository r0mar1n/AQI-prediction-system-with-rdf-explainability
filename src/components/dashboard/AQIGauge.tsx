import { Card } from "@/components/ui/card";
import { getAQILevel } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AQIGaugeProps {
  aqi: number;
  className?: string;
}

export default function AQIGauge({ aqi, className }: AQIGaugeProps) {
  const { level, bgColor, textColor, description } = getAQILevel(aqi);
  const percentage = Math.min((aqi / 500) * 100, 100);

  return (
    <Card className={cn("p-6 h-full flex flex-col", className)}>
      <div className="flex flex-col justify-between h-full">
        
        {/* Top Section */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Air Quality Index
            </h3>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                bgColor,
                textColor
              )}
            >
              {level}
            </span>
          </div>

          {/* AQI Number */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {Math.round(aqi)}
              </span>
              <span className="text-base text-muted-foreground">
                AQI
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom Section (Gauge stays at bottom for symmetry) */}
        <div className="mt-6">
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", bgColor)}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0</span>
            <span>100</span>
            <span>200+</span>
            <span>500</span>
          </div>
        </div>
      </div>
    </Card>
  );
}