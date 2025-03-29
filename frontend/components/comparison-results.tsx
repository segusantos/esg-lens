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
    { category: "Environmental", company1: 92, company2: 72 },
    { category: "Social", company1: 85, company2: 81 },
    { category: "Governance", company1: 84, company2: 82 },
    { category: "Overall ESG", company1: 87, company2: 78 },
  ]

  const yearsData = [
    { category: "Environmental", year1: 92, year2: 88 },
    { category: "Social", year1: 85, year2: 80 },
    { category: "Governance", year1: 84, year2: 79 },
    { category: "Overall ESG", year1: 87, year2: 82 },
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
        second: "#3b82f6", // Social blue for second company
      }
    } else {
      return {
        first: "#6366f1", // Indigo for current year
        second: "#f97316", // Governance orange for previous year
      }
    }
  }

  const barColors = getBarColors()

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Comparison Results</h2>

      <Tabs defaultValue="scores">
        <TabsList>
          <TabsTrigger value="scores">ESG Scores</TabsTrigger>
          <TabsTrigger value="details">Detailed Comparison</TabsTrigger>
          <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ESG Score Comparison</CardTitle>
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
                    <span>Report Quality:</span>
                    <span className="font-medium">High</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Disclosure Level:</span>
                    <span className="font-medium">Comprehensive</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Carbon Emissions:</span>
                    <span className="font-medium">15% Reduction YoY</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Renewable Energy:</span>
                    <span className="font-medium">78% of Total</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Diversity Metrics:</span>
                    <span className="font-medium">42% Women in Leadership</span>
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
                    <span>Report Quality:</span>
                    <span className="font-medium">Medium</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Disclosure Level:</span>
                    <span className="font-medium">Partial</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Carbon Emissions:</span>
                    <span className="font-medium">8% Reduction YoY</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Renewable Energy:</span>
                    <span className="font-medium">45% of Total</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Diversity Metrics:</span>
                    <span className="font-medium">35% Women in Leadership</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ESG Factors Radar Chart</CardTitle>
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

