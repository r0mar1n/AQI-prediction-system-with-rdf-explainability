import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PollutantBreakdown {
  name: string;
  sub_index: number;
  source: string;
  health_risk: string;
  vulnerable: string;
  citizen_advice: string;
  gov_protocol: string;
}

interface PollutantCardProps {
  pollutant: PollutantBreakdown;
}

export default function PollutantCard({ pollutant }: PollutantCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { name, sub_index, source, health_risk, vulnerable, citizen_advice, gov_protocol } = pollutant;

  const formattedSubIndex =
    typeof sub_index === "number" && !Number.isNaN(sub_index) ? sub_index.toFixed(1) : String(sub_index ?? "-");

  return (
    <Card className="p-4 transition-all duration-300 hover:shadow-card-hover">
      <button
        type="button"
        className="w-full flex items-start justify-between text-left"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <div className="text-sm font-medium text-muted-foreground">{name}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{formattedSubIndex}</span>
            <span className="text-xs text-muted-foreground">Sub-Index</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary ml-3">
          <span>{isOpen ? "Hide details" : "View details"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "mt-4 max-h-96 opacity-100" : "mt-0 max-h-0 opacity-0"
        )}
      >
        <div className="space-y-3 text-xs text-muted-foreground">
          <DetailRow label="Source" value={source} />
          <DetailRow label="Health Risk" value={health_risk} />
          <DetailRow label="Vulnerable Group" value={vulnerable} />
          <DetailRow label="Citizen Advice" value={citizen_advice} />
          <DetailRow label="Government Protocol" value={gov_protocol} />
        </div>
      </div>
    </Card>
  );
}

interface DetailRowProps {
  label: string;
  value?: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <div className="text-[0.7rem] font-semibold text-foreground/80">{label}:</div>
      <p className="text-xs leading-snug">{value}</p>
    </div>
  );
}
