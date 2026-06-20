import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, Network, CheckCircle, Database } from "lucide-react";

export default function ModelInsights() {

  const models = [
    {
      name: "LSTM Forecast Model",
      description:
        "Long Short-Term Memory neural network trained on historical pollution and weather time-series data to forecast AQI trends.",
      features: [
        "Captures long-term temporal dependencies",
        "Learns pollution trend patterns",
        "Handles time-series environmental data",
      ],
    },
    {
      name: "BiLSTM Forecast Model",
      description:
        "Bidirectional LSTM processes pollution sequences both forward and backward to capture deeper temporal relationships.",
      features: [
        "Bidirectional sequence learning",
        "Better temporal context understanding",
        "Improved forecasting accuracy",
      ],
    },
    {
      name: "GRU Forecast Model",
      description:
        "Gated Recurrent Unit model optimized for efficient training and faster inference on environmental time-series data.",
      features: [
        "Lightweight architecture",
        "Faster training compared to LSTM",
        "Effective sequential prediction",
      ],
    },
    {
      name: "Ensemble Forecast Engine",
      description:
        "Combines predictions from LSTM, BiLSTM, and GRU models to generate a more stable AQI forecast.",
      features: [
        "Multi-model aggregation",
        "Improved prediction reliability",
        "Reduced forecasting variance",
      ],
    },
  ];

  const inputFeatures = [
    { name: "PM2.5", description: "Fine particulate pollution harmful to lungs" },
    { name: "PM10", description: "Coarse airborne particles affecting respiratory health" },
    { name: "NO₂", description: "Nitrogen dioxide from vehicle emissions" },
    { name: "O₃", description: "Ground-level ozone formed via photochemical reactions" },
    { name: "CO", description: "Carbon monoxide from incomplete combustion" },
    { name: "Temperature", description: "Ambient temperature influencing pollutant chemistry" },
    { name: "Humidity", description: "Relative humidity affecting particle formation" },
    { name: "Wind Speed", description: "Wind dispersion affecting pollutant distribution" },
  ];

  const predictionSteps = [
    {
      step: 1,
      title: "Environmental Data Collection",
      description:
        "Air quality and weather data are retrieved from environmental APIs such as Open-Meteo.",
    },
    {
      step: 2,
      title: "Data Processing",
      description:
        "Collected data is cleaned, normalized, and transformed into time-series input for deep learning models.",
    },
    {
      step: 3,
      title: "Deep Learning Forecasting",
      description:
        "LSTM, BiLSTM, and GRU models analyze pollution patterns and forecast AQI levels.",
    },
    {
      step: 4,
      title: "Ensemble Prediction",
      description:
        "Predictions from all models are combined to produce a more stable AQI forecast.",
    },
    {
      step: 5,
      title: "Environmental Reasoning",
      description:
        "Priority and dominance analysis determines which pollutant is primarily responsible for AQI changes.",
    },
    {
      step: 6,
      title: "Explainable AI Output",
      description:
        "Results are stored in a knowledge graph to generate transparent environmental explanations.",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Model Insights</h1>
        <p className="text-muted-foreground">
          Understanding the AI system behind air quality predictions
        </p>
      </div>

      {/* Overview */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex gap-4">
          <Brain className="h-10 w-10" />
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Explainable Air Quality Forecasting
            </h2>
            <p className="opacity-90">
              Our platform combines deep learning forecasting models with
              environmental reasoning and semantic knowledge graphs to produce
              transparent AQI predictions.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-white/20 text-white">3 Deep Learning Models</Badge>
              <Badge className="bg-white/20 text-white">Ensemble Forecasting</Badge>
              <Badge className="bg-white/20 text-white">Explainable AI</Badge>
              <Badge className="bg-white/20 text-white">24–72 Hour Forecast</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Models */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Prediction Models</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {models.map((model) => (
            <Card key={model.name} className="p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {model.description}
              </p>

              <div className="mt-4 space-y-2">
                {model.features.map((feature) => (
                  <div key={feature} className="flex gap-2 items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Model Evaluation Metrics */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Model Evaluation Metrics</h2>

        <div className="grid md:grid-cols-2 gap-6">

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Individual Model Performance</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Model</span>
                <span className="font-medium">MAE / RMSE</span>
              </div>

              <div className="flex justify-between">
                <span>LSTM</span>
                <span className="font-medium text-indigo-600">60.17 / 75.78</span>
              </div>

              <div className="flex justify-between">
                <span>GRU</span>
                <span className="font-medium text-indigo-600">98.59 / 114.05</span>
              </div>

              <div className="flex justify-between">
                <span>BiLSTM</span>
                <span className="font-medium text-indigo-600">90.54 / 107.31</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Ensemble Forecast Performance</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Weighted Ensemble MAE</span>
                <span className="font-medium text-indigo-600">72.57</span>
              </div>

              <div className="flex justify-between">
                <span>Weighted Ensemble RMSE</span>
                <span className="font-medium text-indigo-600">86.86</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Forecast Reliability */}

        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">AQI Category Alignment</p>
            <p className="text-3xl font-bold text-indigo-600">85–90%</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Trend Direction Accuracy</p>
            <p className="text-3xl font-bold text-indigo-600">80–88%</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Forecast Horizon</p>
            <p className="text-3xl font-bold text-indigo-600">72h</p>
          </Card>

        </div>

      </div>

      {/* Input Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Environmental Input Features</h2>

        <Card className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {inputFeatures.map((feature) => (
              <div key={feature.name} className="flex gap-3">
                <Target className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Prediction Pipeline */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Prediction Pipeline</h2>

        <div className="space-y-3">
          {predictionSteps.map((step) => (
            <Card key={step.step} className="p-5">
              <div className="flex gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
                  {step.step}
                </div>

                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Explainability */}

      <Card className="p-6 bg-muted/40">
        <div className="flex gap-2 items-center mb-3">
          <Database className="h-5 w-5 text-indigo-500" />
          <h3 className="font-semibold">Explainable AI & Knowledge Graph</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Predictions are converted into RDF triples linking pollutants,
          weather conditions, and AQI outcomes to explain environmental causes.
        </p>
      </Card>

    </div>
  );
}