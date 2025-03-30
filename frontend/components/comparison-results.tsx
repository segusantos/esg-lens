"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add the import for our utility functions
import { getLetterGrade } from "@/lib/score-utils"

interface ComparisonResultsProps {
  type: string
}

export function ComparisonResults({ type }: ComparisonResultsProps) {
  // Mock data for demonstration
  const companiesData = [
    { category: "General", company1: 87, company2: 78 },
    { category: "Ambiental", company1: 92, company2: 72 },
    { category: "Social", company1: 85, company2: 81 },
    { category: "Gobernanza", company1: 84, company2: 82 },
  ]

  const yearsData = [
    { category: "General", year1: 87, year2: 82 },
    { category: "Ambiental", year1: 92, year2: 88 },
    { category: "Social", year1: 85, year2: 80 },
    { category: "Gobernanza", year1: 84, year2: 79 },
  ]

  const radarData =
    type === "companies"
      ? [
          { subject: "Climate Change", company1: 95, company2: 70 },
          { subject: "Resource Use", company1: 90, company2: 75 },
          { subject: "Waste Management", company1: 88, company2: 72 },
          { subject: "Diversity", company1: 82, company2: 85 },
          { subject: "Human Rights", company1: 87, company2: 78 },
          { subject: "Board Structure", company1: 85, company2: 80 },
          { subject: "Business Ethics", company1: 83, company2: 84 },
        ]
      : [
          { subject: "Climate Change", year1: 95, year2: 90 },
          { subject: "Resource Use", year1: 90, year2: 85 },
          { subject: "Waste Management", year1: 88, year2: 82 },
          { subject: "Diversity", year1: 82, year2: 78 },
          { subject: "Human Rights", year1: 87, year2: 82 },
          { subject: "Board Structure", year1: 85, year2: 80 },
          { subject: "Business Ethics", year1: 83, year2: 79 },
        ]

  const data = type === "companies" ? companiesData : yearsData
  const firstLabel = type === "companies" ? "Green Energy Corp" : "2023"
  const secondLabel = type === "companies" ? "Tech Innovations Inc" : "2022"
  const firstKey = type === "companies" ? "company1" : "year1"
  const secondKey = type === "companies" ? "company2" : "year2"

  // Define colors based on our ESG color scheme
  const getBarColors = () => {
    if (type === "companies") {
      return {
        first: "#22c55e", // Environmental green for first company
        second: "#F97316", // Orange for governance (changed from blue)
      }
    } else {
      return {
        first: "#6366f1", // Indigo for current year
        second: "#F97316", // Governance orange for previous year
      }
    }
  }

  const barColors = getBarColors()

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Resultados de comparación</h2>

      <Tabs defaultValue="scores">
        <TabsList>
          <TabsTrigger value="scores">Puntuaciones ESG</TabsTrigger>
          <TabsTrigger value="details">Comparación detallada</TabsTrigger>
          <TabsTrigger value="radar">Análisis radar</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparación de puntuaciones ESG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="category" type="category" />
                    <Tooltip formatter={(value: number) => [`${value} (${getLetterGrade(value)})`, ""]} />
                    <Legend />
                    <Bar dataKey={firstKey} name={firstLabel} fill={barColors.first} />
                    <Bar dataKey={secondKey} name={secondLabel} fill={barColors.second} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{firstLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Calidad del informe:</span>
                    <span className="font-medium">Alta</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Nivel de divulgación:</span>
                    <span className="font-medium">Completo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Emisiones de carbono:</span>
                    <span className="font-medium">Reducción del 15% interanual</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Energía renovable:</span>
                    <span className="font-medium">78% del total</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Métricas de diversidad:</span>
                    <span className="font-medium">42% mujeres en liderazgo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{secondLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Calidad del informe:</span>
                    <span className="font-medium">Media</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Nivel de divulgación:</span>
                    <span className="font-medium">Parcial</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Emisiones de carbono:</span>
                    <span className="font-medium">Reducción del 8% interanual</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Energía renovable:</span>
                    <span className="font-medium">45% del total</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Métricas de diversidad:</span>
                    <span className="font-medium">35% mujeres en liderazgo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico radar de factores ESG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name={firstLabel}
                      dataKey={type === "companies" ? "company1" : "year1"}
                      stroke={barColors.first}
                      fill={barColors.first}
                      fillOpacity={0.6}
                    />
                    <Radar
                      name={secondLabel}
                      dataKey={type === "companies" ? "company2" : "year2"}
                      stroke={barColors.second}
                      fill={barColors.second}
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

