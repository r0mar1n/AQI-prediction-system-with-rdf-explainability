import { useEffect, useState } from "react";

const facts = [
  "PM2.5 particles are small enough to enter your bloodstream and reach vital organs.",
  "Air pollution is linked to increased risk of heart attacks and strokes.",
  "Ozone pollution is worse during sunny afternoons due to chemical reactions in sunlight.",
  "AQI above 300 is considered hazardous and can affect even healthy individuals.",
  "Children breathe faster than adults, making them more vulnerable to polluted air.",
  "Long-term exposure to pollution can permanently reduce lung capacity.",
  "Indoor air can sometimes be more polluted than outdoor air.",
  "Vehicle emissions are one of the largest contributors to urban air pollution.",
  "Nitrogen dioxide (NO₂) mainly comes from fuel combustion like cars and power plants.",
  "Carbon monoxide (CO) reduces oxygen delivery in the body.",
  "High pollution levels can affect cognitive performance and focus.",
  "Air pollution is a major trigger for asthma attacks.",
  "PM10 particles can irritate the eyes, nose, and throat.",
  "Burning waste and biomass releases toxic pollutants into the air.",
  "Pollution levels often peak during early morning and late evening traffic hours.",
  "Wind speed and direction can significantly affect pollution spread.",
  "Wearing a proper N95 mask can reduce exposure to fine particles.",
  "Plants help, but they cannot fully purify heavily polluted indoor air.",
  "Air quality can vary drastically within the same city.",
  "Industrial emissions contribute heavily to sulfur dioxide (SO₂) levels.",
  "Ozone at ground level is harmful, even though it protects us in the upper atmosphere.",
  "Poor air quality can impact sleep quality and overall energy levels.",
  "Air pollution exposure is linked to increased anxiety and depression risks.",
];

export default function LoadingFacts() {
  const [index, setIndex] = useState(0);

    useEffect(() => {
    let lastIndex = 0;

    const interval = setInterval(() => {
        let newIndex;

        do {
        newIndex = Math.floor(Math.random() * facts.length);
        } while (newIndex === lastIndex); // 🔥 avoid same repeat

        lastIndex = newIndex;
        setIndex(newIndex);

    }, 3000);

    return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[350px] text-center px-4 space-y-6">

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />

      {/* Loading text */}
      <p className="text-sm text-muted-foreground">
        Analyzing air quality data...
      </p>

      {/* Fact card */}
      <div className="bg-card border border-border rounded-xl px-6 py-4 shadow-md max-w-xl">
        <p
          key={index}
          className="text-base font-medium leading-relaxed animate-fade-in"
        >
          {facts[index]}
        </p>
      </div>

    </div>
  );
}