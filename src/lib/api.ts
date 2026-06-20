export function getAQILevel(aqi: number): {
  level: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
} {

  if (aqi <= 50) {
    return {
      level: "Good",
      color: "aqi-good",
      bgColor: "bg-aqi-good",
      textColor: "text-aqi-good-foreground",
      description: "Air quality is satisfactory",
    };
  }

  if (aqi <= 100) {
    return {
      level: "Moderate",
      color: "aqi-moderate",
      bgColor: "bg-aqi-moderate",
      textColor: "text-aqi-moderate-foreground",
      description: "Acceptable for most people",
    };
  }

  if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "aqi-unhealthy-sensitive",
      bgColor: "bg-aqi-unhealthy-sensitive",
      textColor: "text-aqi-unhealthy-sensitive-foreground",
      description: "Sensitive groups may experience effects",
    };
  }

  if (aqi <= 200) {
    return {
      level: "Unhealthy",
      color: "aqi-unhealthy",
      bgColor: "bg-aqi-unhealthy",
      textColor: "text-aqi-unhealthy-foreground",
      description: "Everyone may begin to experience effects",
    };
  }

  if (aqi <= 300) {
    return {
      level: "Very Unhealthy",
      color: "aqi-very-unhealthy",
      bgColor: "bg-aqi-very-unhealthy",
      textColor: "text-aqi-very-unhealthy-foreground",
      description: "Health alert",
    };
  }

  return {
    level: "Hazardous",
    color: "aqi-hazardous",
    bgColor: "bg-aqi-hazardous",
    textColor: "text-aqi-hazardous-foreground",
    description: "Emergency conditions",
  };

}