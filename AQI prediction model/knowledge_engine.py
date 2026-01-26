import os
import joblib
import pandas as pd
from rdflib import Graph, Namespace, URIRef, Literal, RDF, XSD

# --- CONFIGURATION & PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define the subfolder where your data actually lives
DATA_DIR = os.path.join(BASE_DIR, "AQI prediction model")

# Point to the files inside that subfolder
MODEL_PATH = os.path.join(DATA_DIR, "final_aqi_prediction.pkl")
CSV_PATH = os.path.join(DATA_DIR, "Combined_AQ_Weather_NO2_AQI_2024_Robust.csv")

# Define Namespaces
AQ = Namespace("http://aqi-prediction.org/ontology#")
XSD_NS = Namespace("http://www.w3.org/2001/XMLSchema#")

# --- 1. INITIALIZE THE GRAPH ---
def init_graph():
    g = Graph()
    g.bind("aq", AQ)
    
    # Standard properties
    AQ.mitigationAdvice = URIRef("http://aqi-prediction.org/ontology#mitigationAdvice")
    AQ.affectedGroup = URIRef("http://aqi-prediction.org/ontology#affectedGroup")
    AQ.hasDynamicWarning = URIRef("http://aqi-prediction.org/ontology#hasDynamicWarning")
    AQ.hasContextualInsight = URIRef("http://aqi-prediction.org/ontology#hasContextualInsight")
    
    # --- NEW ADVANCED DEFINITIONS ---
    AQ.regulatoryStatus = URIRef("http://aqi-prediction.org/ontology#regulatoryStatus")
    AQ.dataQualityFlag = URIRef("http://aqi-prediction.org/ontology#dataQualityFlag")
    AQ.chemicalSynergy = URIRef("http://aqi-prediction.org/ontology#chemicalSynergy")
    
    return g

# --- 2. ADD EXPERT KNOWLEDGE (Expanded Version) ---
def add_expert_knowledge(g):
    """
    Adds static domain knowledge about pollutants, including mitigation strategies 
    and vulnerable groups.
    """
    knowledge_base = {
        "PM2.5": {
            "source": "Vehicle exhaust, construction dust",
            "risk": "Penetrates deep into lungs, asthma aggravation",
            "mitigation": "Use air purifiers, wear N95 masks, restrict outdoor exercise",
            "vulnerable": "Children, Elderly, Asthmatics"
        },
        "PM10": {
            "source": "Dust storms, agriculture",
            "risk": "Lung irritation, coughing",
            "mitigation": "Wet sweeping of roads, cover construction sites",
            "vulnerable": "Construction workers, people with bronchitis"
        },
        "NO2": {
            "source": "Burning of fossil fuels (cars)",
            "risk": "Inflammation of airways, reduced lung function",
            "mitigation": "Avoid traffic-heavy routes, carpool, use electric vehicles",
            "vulnerable": "Children with asthma"
        },
        "Ozone": {
            "source": "Chemical reaction in sunlight",
            "risk": "Chest pain, throat irritation",
            "mitigation": "Refuel cars in the evening, limit daytime driving",
            "vulnerable": "Outdoor workers, active children"
        },
        "CO": {
            "source": "Incomplete combustion",
            "risk": "Reduces oxygen delivery to body's organs",
            "mitigation": "Ensure proper ventilation indoors, check car exhaust",
            "vulnerable": "People with heart disease"
        },
        "temperature": {
            "source": "Meteorological condition",
            "risk": "High heat accelerates chemical reactions",
            "mitigation": "Stay hydrated, avoid peak sun hours",
            "vulnerable": "Elderly, Infants"
        }
    }

    for feature, info in knowledge_base.items():
        feat_uri = URIRef(f"http://aqi-prediction.org/ontology#Feature_{feature}")
        g.add((feat_uri, RDF.type, AQ.EnvironmentalFeature))
        
        # Standard Properties
        g.add((feat_uri, AQ.hasLikelySource, Literal(info['source'])))
        g.add((feat_uri, AQ.hasHealthRisk, Literal(info['risk'])))
        
        # New Expanded Properties
        if 'mitigation' in info:
            g.add((feat_uri, AQ.mitigationAdvice, Literal(info['mitigation'])))
        if 'vulnerable' in info:
            g.add((feat_uri, AQ.affectedGroup, Literal(info['vulnerable'])))
    
    print("Expanded expert knowledge rules added to graph.")

# --- 3. APPLY INFERENCE RULES (Advanced Logic Layer) ---
def apply_inference_rules(g, prediction_id, features_dict):
    """
    Applies 3 layers of logic: Compliance, Data Integrity, and Chemical Synergy.
    """
    pred_uri = URIRef(f"http://aqi-prediction.org/ontology#Pred_{prediction_id}")
    
    # --- LAYER 1: REGULATORY COMPLIANCE (WHO Standards 2021) ---
    pm25_val = features_dict.get('PM2.5', 0)
    no2_val = features_dict.get('NO2', 0)
    
    if pm25_val > 15:
        status = f"Violates WHO PM2.5 Guideline (Limit: 15, Observed: {pm25_val})"
        g.add((pred_uri, AQ.regulatoryStatus, Literal(status)))
    
    if no2_val > 25:
         status = f"Violates WHO NO2 Guideline (Limit: 25, Observed: {no2_val})"
         g.add((pred_uri, AQ.regulatoryStatus, Literal(status)))

    # --- LAYER 2: DATA INTEGRITY (Robustness Checks) ---
    # Catches broken sensors (e.g., negative values) or extreme outliers
    for feature, value in features_dict.items():
        if value < 0:
            error_msg = f"Sensor Error: Negative value detected for {feature}"
            g.add((pred_uri, AQ.dataQualityFlag, Literal(error_msg)))
            
        if feature == "PM2.5" and value > 900:
            error_msg = f"Data Spike: Value {value} exceeds calibrated range."
            g.add((pred_uri, AQ.dataQualityFlag, Literal(error_msg)))

    # --- LAYER 3: CHEMICAL SYNERGY (Multi-Factor Interactions) ---
    # Rule: Photochemical Smog (High Temp + High NO2)
    temp = features_dict.get('temperature', 0)
    
    if temp > 30 and no2_val > 40:
        synergy = "Photochemical Smog Risk: High solar radiation interacting with traffic fumes."
        g.add((pred_uri, AQ.chemicalSynergy, Literal(synergy)))
        g.add((pred_uri, AQ.mitigationAdvice, Literal("Avoid refueling vehicles until evening.")))

    # Rule: Stagnation (High PM + Low Wind)
    wind = features_dict.get('windspeed', 5)
    if pm25_val > 50 and wind < 1.0:
        synergy = "Severe Stagnation: Lack of ventilation is accumulating particulates."
        g.add((pred_uri, AQ.chemicalSynergy, Literal(synergy)))
        g.add((pred_uri, AQ.mitigationAdvice, Literal("Do not open windows. Use air filtration immediately.")))

    print("Advanced inference rules applied.")

# --- 4. CONVERT PREDICTION TO RDF ---
def generate_rdf_for_prediction(g, prediction_id, features_dict, prediction_result):
    pred_uri = URIRef(f"http://aqi-prediction.org/ontology#Pred_{prediction_id}")
    
    # Add Prediction Info
    g.add((pred_uri, RDF.type, AQ.Prediction))
    g.add((pred_uri, AQ.hasPredictedValue, Literal(prediction_result, datatype=XSD.float)))
    
    # Add Feature Influences
    for name, value in features_dict.items():
        clean_name = name.replace(" ", "_")
        feat_uri = URIRef(f"http://aqi-prediction.org/ontology#Feature_{clean_name}")
        
        g.add((pred_uri, AQ.hasFeatureInput, feat_uri))
        g.add((feat_uri, AQ.hasObservedValue, Literal(value, datatype=XSD.float)))

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    print("--- Starting RDF Knowledge Engine ---")
    
    # 1. Setup
    g = init_graph()
    add_expert_knowledge(g)

    # 2. Try to load real data
    if os.path.exists(CSV_PATH):
        try:
            print(f"Loading data from {CSV_PATH}...")
            df = pd.read_csv(CSV_PATH)
            
            # Get the last row of data to act as our "Current Scenario"
            latest_row = df.iloc[-1]
            pred_id = "Current_Observation"
            
            feature_data = {
                "PM2.5": latest_row.get("PM2.5", 0),
                "PM10": latest_row.get("PM10", 0),
                "NO2": latest_row.get("NO2", 0),
                "Ozone": latest_row.get("Ozone", 0),
                "temperature": latest_row.get("temperature", 0),
                "windspeed": latest_row.get("windspeed", 0)
            }
            
            predicted_aqi = latest_row.get("Final_AQI", 150) 
            
            # Generate Basic RDF
            generate_rdf_for_prediction(g, pred_id, feature_data, predicted_aqi)
            
            # Apply Advanced Inference Rules
            apply_inference_rules(g, pred_id, feature_data)
            
            print(f"Generated RDF for observation: {pred_id}")
            
        except Exception as e:
            print(f"Error reading CSV: {e}")
    else:
        print(f"WARNING: Could not find CSV at {CSV_PATH}")

    # 3. Serialize Output
    output_file = "final_aqi_knowledge_graph.ttl"
    g.serialize(destination=output_file, format="turtle")
    print(f"SUCCESS: Knowledge Graph saved to '{output_file}'")
    print("---------------------------------------")