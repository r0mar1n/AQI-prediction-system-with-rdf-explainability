from rdflib import Graph, Namespace

# 1. Load the Enriched Graph
g = Graph()
try:
    g.parse("final_aqi_knowledge_graph.ttl", format="turtle")
    print("✅ Knowledge Graph loaded successfully.\n")
except:
    print("❌ Could not find the graph file. Run 'knowledge_engine.py' first!")
    exit()

# 2. Define Namespace
AQ = Namespace("http://aqi-prediction.org/ontology#")

# 3. Advanced SPARQL Query
# This query asks for everything: Standard risks PLUS the new Advanced Rules
query = """
    PREFIX aq: <http://aqi-prediction.org/ontology#>
    
    SELECT ?feature ?value ?risk ?source ?mitigation ?vulnerable ?warning ?insight ?regStatus ?quality ?synergy
    WHERE {
        ?pred a aq:Prediction .
        
        # --- Retrieve Advanced System Flags (Optional) ---
        OPTIONAL { ?pred aq:regulatoryStatus ?regStatus . }
        OPTIONAL { ?pred aq:dataQualityFlag ?quality . }
        OPTIONAL { ?pred aq:chemicalSynergy ?synergy . }
        OPTIONAL { ?pred aq:hasDynamicWarning ?warning . }
        OPTIONAL { ?pred aq:hasContextualInsight ?insight . }

        # --- Retrieve Feature Details ---
        ?pred aq:hasFeatureInput ?featURI .
        ?featURI aq:hasObservedValue ?value ;
                 aq:hasHealthRisk ?risk ;
                 aq:hasLikelySource ?source .
                 
        # --- Retrieve Expert Advice (Optional) ---
        OPTIONAL { ?featURI aq:mitigationAdvice ?mitigation . }
        OPTIONAL { ?featURI aq:affectedGroup ?vulnerable . }
                 
        # Clean up the URI to just get the name (e.g., "PM2.5")
        BIND(STRAFTER(STR(?featURI), "Feature_") AS ?feature)
    }
"""

# 4. Generate the Advanced Report
results = list(g.query(query))

# Extract unique global flags to avoid printing duplicates
unique_regulatory = set()
unique_quality = set()
unique_synergy = set()

for row in results:
    if row.regStatus: unique_regulatory.add(str(row.regStatus))
    if row.quality: unique_quality.add(str(row.quality))
    if row.synergy: unique_synergy.add(str(row.synergy))

print("=======================================================")
print("       📢  AI AIR QUALITY EXPLAINABILITY REPORT       ")
print("=======================================================\n")

# SECTION A: Data Integrity (The "Debug" Layer)
if unique_quality:
    print("🚨 SENSOR SYSTEM ALERTS (DEBUG):")
    for q in unique_quality:
        print(f"   [X] {q}")
    print("-" * 55)

# SECTION B: Regulatory Compliance (The "Legal" Layer)
if unique_regulatory:
    print("⚖️  REGULATORY COMPLIANCE (WHO STANDARDS):")
    for r in unique_regulatory:
        print(f"   [!] {r}")
    print("-" * 55)

# SECTION C: Complex Atmospheric Interactions (The "Science" Layer)
if unique_synergy:
    print("⚗️  ATMOSPHERIC SYNERGY:")
    for s in unique_synergy:
        print(f"   [~] {s}")
    print("-" * 55)

# SECTION D: Detailed Factor Breakdown
print("Detailed Factor Breakdown:\n")
processed_features = set()

for row in results:
    if row.feature in processed_features:
        continue
    processed_features.add(row.feature)
    
    print(f"🔹 FACTOR: {row.feature}")
    print(f"   • Value:      {row.value}")
    print(f"   • Cause:      {row.source}")
    print(f"   • Impact:     {row.risk}")
    
    if row.vulnerable:
        print(f"   • Vulnerable: {row.vulnerable}")
    if row.mitigation:
        print(f"   • ADVICE:     {row.mitigation}")
        
    print("   " + "-" * 40)