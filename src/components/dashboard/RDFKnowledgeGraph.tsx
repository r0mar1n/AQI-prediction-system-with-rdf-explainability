import { useEffect, useRef, useState } from "react"
import { Network } from "vis-network/standalone"

export default function RDFKnowledgeGraph({ summary }: { summary: any }) {

  const ref = useRef<HTMLDivElement>(null)
  const networkRef = useRef<any>(null)

  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {

    if (!summary || !ref.current) return

    const dominant = summary.dominant_pollutant
    const pollutants = summary.sub_indices

    const rdfNodes = summary.rdf_graph.nodes
    const rdfEdges = summary.rdf_graph.edges

    const nodes: any[] = []
    const edges: any[] = []

    const wrap = (text: string, width = 45) =>
      text.replace(new RegExp(`(.{1,${width}})(\\s|$)`, "g"), "$1\n")

    /* ---------------------------
    🔥 TIGHTER SPACING VALUES
    --------------------------- */

    const spacingTop = 160
    const spacingMid = 140
    const spacingBottom = 180

    /* Forecast */
    nodes.push({
      id: "forecast",
      label: "Forecast",
      shape: "box",
      x: 0,
      y: -spacingTop,
      color: "#0ea5e9",
      font: { size: 24, bold: true }
    })

    /* Pollutants */
    const pollutantNames = Object.keys(pollutants)
    const spacing = 160

    pollutantNames.forEach((name, i) => {
      nodes.push({
        id: name,
        label: `${name}\n${Number(pollutants[name]).toFixed(2)}`,
        shape: "dot",
        size: 30,
        x: (i - pollutantNames.length / 2) * spacing,
        y: -20,
        color: name === dominant ? "#ef4444" : "#60a5fa",
        font: { size: 15 }
      })

      edges.push({ from: "forecast", to: name })
    })

    /* Dominant */
    nodes.push({
      id: "dominant",
      label: `Dominant\n${dominant}`,
      shape: "box",
      x: 0,
      y: spacingMid,
      color: "#ef4444",
      font: { size: 20, bold: true }
    })

    edges.push({ from: dominant, to: "dominant" })

    /* RDF */
    const featureId = `Feature_${dominant}`
    const relatedEdges = rdfEdges.filter((e: any) => e.source === featureId)

    relatedEdges.forEach((edge: any, i: number) => {

      const property = edge.label
      const valueNode = rdfNodes.find((n: any) => n.id === edge.target)
      if (!valueNode) return

      const xPos = (i - relatedEdges.length / 2) * spacingBottom
      const propertyId = `${property}_node`

      nodes.push({
        id: propertyId,
        label: property.replace(/([A-Z])/g, " $1").trim(),
        shape: "box",
        x: xPos,
        y: 260,
        color: "#f59e0b",
        font: { size: 20 }
      })

      edges.push({ from: "dominant", to: propertyId })

      nodes.push({
        id: `value_${property}`,
        label: wrap(valueNode.label, 50),
        shape: "box",
        x: xPos,
        y: 360, // 🔥 reduced gap
        color: "#94a3b8",
        font: { size: 18 }
      })

      edges.push({ from: propertyId, to: `value_${property}` })

    })

    const network = new Network(
      ref.current,
      { nodes, edges },
      {
        physics: false,

        interaction: {
          zoomView: true,
          dragView: true,
          zoomSpeed: 0.25
        },

        nodes: {
          borderWidth: 1.5,
          margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }
        },

        edges: {
          arrows: { to: true },
          smooth: true
        }
      }
    )

    networkRef.current = network

    /* 🔥 ZOOM SWEET SPOT */
    const MIN_SCALE = 0.9
    const MAX_SCALE = 1.7

    network.on("zoom", (params) => {
      if (params.scale < MIN_SCALE) network.moveTo({ scale: MIN_SCALE })
      if (params.scale > MAX_SCALE) network.moveTo({ scale: MAX_SCALE })
    })

    /* 🔥 PAN LIMIT (TIGHTER BOX) */
    const LIMIT_X = 700
    const LIMIT_Y = 500

    network.on("dragEnd", () => {
      const pos = network.getViewPosition()
      const scale = network.getScale()

      const x = Math.max(-LIMIT_X, Math.min(LIMIT_X, pos.x))
      const y = Math.max(-LIMIT_Y, Math.min(LIMIT_Y, pos.y))

      network.moveTo({
        position: { x, y },
        scale
      })
    })

    return () => network.destroy()

  }, [summary, resetKey])

  /* 🔥 RESET = FULL RELOAD */
  const resetView = () => {
    setResetKey(prev => prev + 1)
  }

  return (
    <div className="relative">

      <button
        onClick={resetView}
        className="absolute top-4 right-4 z-10 bg-white border px-4 py-1 rounded shadow"
      >
        Reset View
      </button>

      <div
        ref={ref}
        style={{
          height: "700px", // 🔥 slightly reduced
          width: "100%",
          borderRadius: "16px",
          background: "#f8fafc"
        }}
      />

    </div>
  )
}