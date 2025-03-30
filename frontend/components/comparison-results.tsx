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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Add the import for our utility functions
import { getLetterGrade } from "@/lib/score-utils"

interface ComparisonResultsProps {
  type: string;
  data?: any;
}

export function ComparisonResults({ type, data }: ComparisonResultsProps) {
  // Use passed data or fallback to mock data for demonstration
  const isUsingMockData = !data;
  
  // Prepare data for charts
  const prepareChartData = () => {
    if (data) {
      const report1 = data.report1 || {};
      const report2 = data.report2 || {};
      
      console.log("Comparison data for chart:", { report1, report2 });
      
      // Extract scores from different possible locations
      const getScore = (report, scoreType) => {
        const camelCase = scoreType.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        
        if (report[camelCase] !== undefined && report[camelCase] !== null) {
          return report[camelCase];
        }
        
        // Try snake_case
        if (report[scoreType] !== undefined && report[scoreType] !== null) {
          return report[scoreType];
        }
        
        // Try from SCORES object
        if (report.SCORES && report.SCORES[scoreType] !== undefined) {
          return report.SCORES[scoreType];
        }
        
        // Try from scores object
        if (report.scores && report.scores[scoreType] !== undefined) {
          return report.scores[scoreType];
        }
        
        // Try specific alternate names for ESG scores
        if (scoreType === 'esg_score' || scoreType === 'esgScore') {
          return report.overall_score || 
                (report.SCORES ? report.SCORES.overall_score : null) || 
                0;
        }
        
        if (scoreType === 'environment_score' || scoreType === 'environmentScore') {
          return report.global_enviroment_score || 
                (report.SCORES ? report.SCORES.global_enviroment_score : null) || 
                0;
        }
        
        if (scoreType === 'social_score' || scoreType === 'socialScore') {
          return report.global_social_score || 
                (report.SCORES ? report.SCORES.global_social_score : null) || 
                0;
        }
        
        if (scoreType === 'governance_score' || scoreType === 'governanceScore') {
          return report.global_governance_score || 
                (report.SCORES ? report.SCORES.global_governance_score : null) || 
                0;
        }
        
        return 0;
      };
      
      // Map real data to chart format
      return [
        { 
          category: "General", 
          first: getScore(report1, 'esg_score'), 
          second: getScore(report2, 'esg_score')
        },
        { 
          category: "Ambiental", 
          first: getScore(report1, 'environment_score'), 
          second: getScore(report2, 'environment_score')
        },
        { 
          category: "Social", 
          first: getScore(report1, 'social_score'), 
          second: getScore(report2, 'social_score')
        },
        { 
          category: "Gobernanza", 
          first: getScore(report1, 'governance_score'), 
          second: getScore(report2, 'governance_score')
        },
      ];
    } else {
      // Fall back to mock data
      return type === "companies" 
        ? [
            { category: "General", first: 87, second: 78 },
            { category: "Ambiental", first: 92, second: 72 },
            { category: "Social", first: 85, second: 81 },
            { category: "Gobernanza", first: 84, second: 82 },
          ]
        : [
            { category: "General", first: 87, second: 82 },
            { category: "Ambiental", first: 92, second: 88 },
            { category: "Social", first: 85, second: 80 },
            { category: "Gobernanza", first: 84, second: 79 },
          ];
    }
  };
  
  // Prepare radar data
  const prepareRadarData = () => {
    if (data) {
      const report1 = data.report1 || {};
      const report2 = data.report2 || {};
      
      console.log("Preparing radar data from:", { report1, report2 });
      
      // Helper function to get all possible subscores
      const getAllSubScores = (report, category) => {
        const result = {};
        
        // Check all possible locations for subscores
        const locations = [
          // Check in scores object with various naming conventions
          report.scores?.enviroment_scores,
          report.scores?.environmental_scores,
          report.scores?.environment_scores,
          report.scores?.social_scores,
          report.scores?.governance_scores,
          
          // Check in SCORES object (uppercase)
          report.SCORES?.enviroment_scores,
          report.SCORES?.environmental_scores,
          report.SCORES?.environment_scores,
          report.SCORES?.social_scores,
          report.SCORES?.governance_scores,
          
          // Direct properties that might contain subscores
          report.enviroment_scores,
          report.environmental_scores,
          report.environment_scores,
          report.social_scores,
          report.governance_scores,
          
          // Camel case variants
          report.enviromentScores,
          report.environmentalScores,
          report.environmentScores,
          report.socialScores,
          report.governanceScores
        ];
        
        // For each potential location
        locations.forEach(location => {
          if (location && typeof location === 'object') {
            // Merge all found subscores
            Object.entries(location).forEach(([key, value]) => {
              result[key] = value;
            });
          }
        });
        
        return result;
      };
      
      // Get all subscores for each category
      const envScores1 = getAllSubScores(report1, 'environment');
      const envScores2 = getAllSubScores(report2, 'environment');
      
      const socialScores1 = getAllSubScores(report1, 'social');
      const socialScores2 = getAllSubScores(report2, 'social');
      
      const govScores1 = getAllSubScores(report1, 'governance');
      const govScores2 = getAllSubScores(report2, 'governance');
      
      console.log("Extracted subscores:", { 
        env: { report1: envScores1, report2: envScores2 },
        social: { report1: socialScores1, report2: socialScores2 },
        gov: { report1: govScores1, report2: govScores2 }
      });
      
      // Combine all scores into radar format
      const radarData = [];
      
      // Collect all possible keys across both reports
      const envKeys = new Set([...Object.keys(envScores1), ...Object.keys(envScores2)]);
      const socialKeys = new Set([...Object.keys(socialScores1), ...Object.keys(socialScores2)]);
      const govKeys = new Set([...Object.keys(govScores1), ...Object.keys(govScores2)]);
      
      // Add environmental scores
      for (const key of envKeys) {
        radarData.push({
          subject: key,
          first: envScores1[key] || 0,
          second: envScores2[key] || 0,
          category: 'Ambiental'
        });
      }
      
      // Add social scores
      for (const key of socialKeys) {
        radarData.push({
          subject: key,
          first: socialScores1[key] || 0,
          second: socialScores2[key] || 0,
          category: 'Social'
        });
      }
      
      // Add governance scores
      for (const key of govKeys) {
        radarData.push({
          subject: key,
          first: govScores1[key] || 0,
          second: govScores2[key] || 0,
          category: 'Gobernanza'
        });
      }
      
      return radarData.length > 0 ? radarData : null;
    }
    
    // Fall back to mock data
    return type === "companies"
      ? [
          { subject: "Climate Change", first: 95, second: 70 },
          { subject: "Resource Use", first: 90, second: 75 },
          { subject: "Waste Management", first: 88, second: 72 },
          { subject: "Diversity", first: 82, second: 85 },
          { subject: "Human Rights", first: 87, second: 78 },
          { subject: "Board Structure", first: 85, second: 80 },
          { subject: "Business Ethics", first: 83, second: 84 },
        ]
      : [
          { subject: "Climate Change", first: 95, second: 90 },
          { subject: "Resource Use", first: 90, second: 85 },
          { subject: "Waste Management", first: 88, second: 82 },
          { subject: "Diversity", first: 82, second: 78 },
          { subject: "Human Rights", first: 87, second: 82 },
          { subject: "Board Structure", first: 85, second: 80 },
          { subject: "Business Ethics", first: 83, second: 79 },
        ];
  };

  const chartData = prepareChartData();
  const radarData = prepareRadarData();
  
  // Get labels for the comparison
  const getLabels = () => {
    if (data) {
      if (type === "companies") {
        return {
          first: data.report1?.company || "Empresa 1",
          second: data.report2?.company || "Empresa 2"
        };
      } else {
        return {
          first: `${data.report1?.year || "Año actual"}`,
          second: `${data.report2?.year || "Año anterior"}`
        };
      }
    } else {
      return {
        first: type === "companies" ? "Green Energía Corp" : "2023",
        second: type === "companies" ? "Tech Innovations Inc" : "2022"
      };
    }
  };
  
  const labels = getLabels();
  const firstKey = "first";
  const secondKey = "second";

  // Define colors based on our ESG color scheme
  const getBarColors = () => {
    if (type === "companies") {
      return {
        first: "#22c55e", // Environmental green for first company
        second: "#F97316", // Orange for governance
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
      <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Resultados de comparación</h2>
        {isUsingMockData && (
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Datos de ejemplo</Badge>
        )}
      </div>

      <Tabs defaultValue="scores">
        <TabsList className="gap-1">
          <TabsTrigger value="scores" className="px-4">Puntuaciones ESG</TabsTrigger>
          <TabsTrigger value="details" className="px-4">Comparación</TabsTrigger>
          <TabsTrigger value="radar" className="px-4">Análisis radar</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparación de puntuaciones ESG</CardTitle>
              <CardDescription>
          Comparando {labels.first} con {labels.second}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical" 
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip formatter={(value: number) => [`${value} (${getLetterGrade(value)})`, ""]} />
              <Legend />
              <Bar dataKey={firstKey} name={labels.first} fill={barColors.first} />
              <Bar dataKey={secondKey} name={labels.second} fill={barColors.second} />
            </BarChart>
          </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{labels.first}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data ? (
                    <>
                      <li className="flex justify-between">
                        <span>Empresa:</span>
                        <span className="font-medium">{data.report1?.company || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Año:</span>
                        <span className="font-medium">{data.report1?.year || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Industria:</span>
                        <span className="font-medium">{data.report1?.industry || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>ESG Score:</span>
                        <span className="font-medium">{data.report1.SCORES.overall_score || "-"}</span>
                      </li>
                    </>
                  ) : (
                    <>
                  <li className="flex justify-between">
                          <span>ESG Score:</span>
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
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{labels.second}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data ? (
                    <>
                      <li className="flex justify-between">
                        <span>Empresa:</span>
                        <span className="font-medium">{data.report2?.company || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Año:</span>
                        <span className="font-medium">{data.report2?.year || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Industria:</span>
                        <span className="font-medium">{data.report2?.industry || "-"}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>ESG Score:</span>
                        <span className="font-medium">{data.report2.SCORES.overall_score || "-"}</span>
                      </li>
                    </>
                  ) : (
                    <>
                  <li className="flex justify-between">
                    <span>ESG Score:</span>
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
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico radar de factores ESG</CardTitle>
              <CardDescription>
                Comparación de aspectos específicos entre {labels.first} y {labels.second}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name={labels.first}
                      dataKey="first"
                      stroke={barColors.first}
                      fill={barColors.first}
                      fillOpacity={0.6}
                    />
                    <Radar
                      name={labels.second}
                      dataKey="second"
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

