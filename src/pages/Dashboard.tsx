import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AQIGauge from "@/components/dashboard/AQIGauge";
import ExecutiveSummaryPanel from "@/components/dashboard/ExecutiveSummaryPanel";
import RDFKnowledgeGraph from "@/components/dashboard/RDFKnowledgeGraph";
import LoadingFacts from "@/components/dashboard/LoadingFacts"; // ✅ NEW

interface PollutantDetail {
  name: string;
  value: number;
}

function getAQIColor(value: number) {
  if (value <= 50) return "#22c55e";
  if (value <= 100) return "#38bdf8";
  if (value <= 200) return "#fde047";
  if (value <= 300) return "#fb923c";
  if (value <= 400) return "#dc2626";
  return "#7f1d1d";
}

function getSeverityBorder(value: number) {
  if (value > 300) return "border-red-600";
  if (value > 200) return "border-orange-500";
  if (value > 100) return "border-yellow-400";
  if (value > 50) return "border-blue-400";
  return "border-green-500";
}

function getPollutantExplanation(summary: any, pollutantName: string) {
  const nodes = summary?.rdf_graph?.nodes || [];
  const edges = summary?.rdf_graph?.edges || [];

  const featureId = `Feature_${pollutantName}`;
  const explanation: any = {};

  edges
    .filter((edge: any) => edge.source === featureId)
    .forEach((edge: any) => {
      const valueNode = nodes.find((node: any) => node.id === edge.target);
      if (!valueNode) return;
      explanation[edge.label] = valueNode.label;
    });

  return explanation;
}

export default function Dashboard() {
  const [searchParams] = useSearchParams();

  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const [aqi, setAQI] = useState(0);
  const [forecast, setForecast] = useState<number[]>([]);
  const [pollutants, setPollutants] = useState<PollutantDetail[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchAQI = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/aqi?lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        setSummary(data || {});
        setAQI(Number(data?.predicted_aqi_next_24h || 0));

        const forecastData = data?.forecast_full || [];
        setForecast(Array.isArray(forecastData) ? forecastData : []);

        const pollutantList: PollutantDetail[] =
          Object.entries(data?.sub_indices || {}).map(([name, value]: any) => ({
            name,
            value: Number(value) || 0,
          }));

        const dominant = data?.dominant_pollutant;
        const priority = data?.priority_analysis?.priority_pollutant;

        const sorted = pollutantList.sort((a, b) => b.value - a.value);

        const selected: PollutantDetail[] = [];

        const dominantPollutant = sorted.find((p) => p.name === dominant);
        if (dominantPollutant) selected.push(dominantPollutant);

        if (priority && priority !== dominant) {
          const priorityPollutant = sorted.find((p) => p.name === priority);
          if (priorityPollutant) selected.push(priorityPollutant);
        }

        for (const item of sorted) {
          if (selected.length === 3) break;
          if (!selected.find((p) => p.name === item.name)) {
            selected.push(item);
          }
        }

        setPollutants(selected);
      } catch (error) {
        console.error("AQI fetch error:", error);
      }

      setLoading(false);
    };

    fetchAQI();
  }, [lat, lng]);

  /* ---------------------------
  🚫 No location selected
  --------------------------- */

  if (!lat || !lng) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-semibold">
          Select a City to View AQI Insights
        </h2>
        <p className="text-muted-foreground">
          Use the map or search bar on the homepage to choose a city.
        </p>
      </div>
    );
  }

  /* ---------------------------
  🔥 LOADING STATE (UPDATED)
  --------------------------- */

  if (loading) {
    return <LoadingFacts />; // ✅ replaced boring loading
  }

  /* ---------------------------
  ⚠️ fallback
  --------------------------- */

  if (!forecast.length) {
    return <div className="text-lg">Forecast unavailable.</div>;
  }

  const solidForecast = forecast.slice(0, 24);
  const dashedForecast = forecast.slice(24, 48);
  const dottedForecast = forecast.slice(48, 72);

  const createPoints = (arr: number[], start: number) => {
    return arr
      .map((value, i) => {
        const index = start + i;
        const x = (index / 71) * 1000;
        const y = 300 - (value / 500) * 300;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Live Dashboard {city && `- ${city}`}
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <AQIGauge aqi={aqi} />
        <ExecutiveSummaryPanel
          className="lg:col-span-2"
          summary={summary}
        />
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          72-Hour AQI Outlook
        </h2>

        <div className="relative h-[320px]">
          <svg viewBox="0 0 1000 300" className="w-full h-full">
            <rect x="0" y="240" width="1000" height="60" fill="#22c55e22"/>
            <rect x="0" y="180" width="1000" height="60" fill="#38bdf822"/>
            <rect x="0" y="120" width="1000" height="60" fill="#fde04722"/>
            <rect x="0" y="60" width="1000" height="60" fill="#fb923c22"/>
            <rect x="0" y="0" width="1000" height="60" fill="#dc262622"/>

            <polyline fill="none" stroke="#0ea5e9" strokeWidth="3"
              points={createPoints(solidForecast, 0)}
            />

            <polyline fill="none" stroke="#0ea5e9" strokeWidth="3"
              strokeDasharray="8,6"
              points={createPoints(dashedForecast, 24)}
            />

            <polyline fill="none" stroke="#0ea5e9" strokeWidth="3"
              strokeDasharray="2,6"
              points={createPoints(dottedForecast, 48)}
            />
          </svg>
        </div>
      </div>

      {summary?.rdf_graph && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            AI Atmospheric Reasoning Graph
          </h2>
          <RDFKnowledgeGraph summary={summary} />
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Top Contributing Pollutants
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pollutants.map((item) => {
            const explanation = getPollutantExplanation(summary, item.name);

            return (
              <div
                key={item.name}
                className={`rounded-2xl border-2 ${getSeverityBorder(item.value)} bg-card p-6 shadow-sm`}
              >
                <div className="flex justify-between mb-4">
                  <div className="font-semibold">{item.name}</div>
                  <div style={{ color: getAQIColor(item.value) }}>
                    {item.value.toFixed(2)}
                  </div>
                </div>

                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><b>Affected Group:</b> {explanation.affectedGroup || "N/A"}</p>
                  <p><b>Health Risk:</b> {explanation.hasHealthRisk || "N/A"}</p>
                  <p><b>Likely Source:</b> {explanation.hasLikelySource || "N/A"}</p>
                  <p><b>Mitigation Advice:</b> {explanation.mitigationAdvice || "N/A"}</p>
                  <p><b>Government Recommendation:</b> {explanation.governmentRecommendation || "N/A"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}