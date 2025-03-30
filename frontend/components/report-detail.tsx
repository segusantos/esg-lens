"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft,
  Download,
  BarChart3,
  Calendar,
  Building,
  Tag,
  ChevronRight,
  Globe,
  ExternalLink,
  FileText,
  BarChart,
  PieChart,
  UsersRound,
  ShieldCheck,
  Leaf,
  Scale,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Update the imports to include our new ESGProgress component
import { ESGProgress } from "@/components/ui/esg-progress"
import { getLetterGrade, getGradeColor, getGradeBackgroundColor } from "@/lib/score-utils"
import { api } from "@/lib/api"

// Mock data for demonstration
const mockReports = [
  {
    id: "1",
    company: "Green Energy Corp",
    ticker: "GEC",
    year: 2023,
    industry: "Energy",
    esgScore: 87,
    environmentScore: 92,
    socialScore: 85,
    governanceScore: 84,
    reportQuality: "High",
    publishDate: "2023-04-15",
    fileUrl: "#",
    websiteUrl: "https://www.greenenergycorp.com",
    summary:
      "Green Energy Corp demonstrates strong commitment to sustainability across all ESG dimensions. The company has made significant progress in reducing carbon emissions, increasing renewable energy usage, and implementing robust governance practices. The report provides comprehensive disclosure with quantitative metrics and clear targets.",
    strengths: [
      "Comprehensive carbon reduction strategy with clear targets",
      "Strong renewable energy transition plan",
      "Detailed diversity and inclusion metrics",
      "Robust board oversight of ESG issues",
      "Transparent supply chain management",
    ],
    weaknesses: [
      "Limited disclosure on water usage metrics",
      "Scope 3 emissions reporting could be more comprehensive",
      "More details needed on community engagement programs",
    ],
    recommendations: [
      "Enhance water usage reporting with specific reduction targets",
      "Expand Scope 3 emissions reporting to cover more categories",
      "Provide more quantitative metrics for social impact programs",
      "Consider third-party verification for all ESG metrics",
    ],
    keyMetrics: {
      carbonEmissions: "125,000 tons (15% reduction YoY)",
      renewableEnergy: "78% of total energy consumption",
      waterUsage: "1.2 million cubic meters (8% reduction YoY)",
      wasteRecycled: "85% of total waste",
      employeeTurnover: "12%",
      diversityScore: "42% women in leadership positions",
      communityInvestment: "$4.5 million",
      boardIndependence: "75% independent directors",
      executivePay: "ESG metrics account for 25% of executive compensation",
    },
  },
]

interface ReportDetailProps {
  id: string
}

// Add helper function for preprocessing markdown
const preprocessMarkdown = (text: string) => {
  if (!text) return '';
  
  // Replace literal '\n' with actual newlines
  let processed = text.replace(/\\n/g, '\n');
  
  // Remove surrounding quotes that might be in the JSON string
  processed = processed.replace(/^"+|"+$/g, '');
  
  // Ensure proper spacing around markdown headings
  processed = processed.replace(/([^#\s])#+\s/g, '$1\n\n# ');
  processed = processed.replace(/#+\s/g, (match) => '\n' + match);
  
  return processed;
};

// Add this helper function after the preprocessMarkdown function
const extractRecommendationsFromFeedback = (feedback: string): string[] => {
  if (!feedback) return [];
  
  // Try to extract numbered recommendations from the feedback text
  // This pattern looks for lines that start with numbers, asterisks, etc.
  const recommendations: string[] = [];
  
  // Remove surrounding quotes that might be in the JSON string
  const cleanFeedback = feedback.replace(/^"+|"+$/g, '');
  
  // First, check if the text has markdown-style numbered lists or bullet points
  const lines = cleanFeedback.split('\\n');
  let inRecommendationList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section headers that might indicate recommendations
    if (line.includes('Mejoras Potenciales') || 
        line.match(/recomendad[ao]s/i) || 
        line.match(/mejorar/i) ||
        line.match(/recomendaciones/i)) {
      inRecommendationList = true;
      continue;
    }
    
    // Check for numbered or bulleted items
    if (inRecommendationList && 
        (line.match(/^\d+\./) || // Numbered list: "1. Item"
         line.match(/^- /) ||   // Bullet list: "- Item"
         line.match(/^\* /) ||  // Alternate bullet: "* Item"
         line.match(/^• /))) {  // Unicode bullet: "• Item"
      
      // Get this recommendation and any continuation lines
      let recommendation = line.replace(/^\d+\.\s*|^-\s*|^\*\s*|^•\s*/, '');
      while (i + 1 < lines.length && !lines[i + 1].trim().match(/^\d+\.|^-|^\*|^•|^$/) && !lines[i + 1].includes(':')) {
        i++;
        recommendation += ' ' + lines[i].trim();
      }
      
      recommendations.push(recommendation);
    }
  }
  
  // Return only the extracted recommendations, not the entire feedback
  return recommendations;
}

export function ReportDetail({ id }: ReportDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMoreLaws, setShowMoreLaws] = useState(false)

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const data = await api.getReport(id)
        
        // Helper function to normalize and extract scores from possible locations
        const extractScores = (scoreType, fallback = {}) => {
          console.log(`Extracting ${scoreType} from:`, data);
          
          // Direct lookup with exact names in SCORES
          if (data.SCORES) {
            if (scoreType === 'enviroment_scores' && data.SCORES.enviroment_scores) {
              console.log("Found enviroment_scores in SCORES", data.SCORES.enviroment_scores);
              return data.SCORES.enviroment_scores;
            }
            
            if (scoreType === 'social_scores' && data.SCORES.social_scores) {
              console.log("Found social_scores in SCORES", data.SCORES.social_scores);
              return data.SCORES.social_scores;
            }
            
            if (scoreType === 'governance_scores' && data.SCORES.governance_scores) {
              console.log("Found governance_scores in SCORES", data.SCORES.governance_scores);
              return data.SCORES.governance_scores;
            }
          }
          
          // Check for scores in both camelCase and snake_case formats
          if (data.scores && data.scores[scoreType]) {
            return data.scores[scoreType];
          }
          if (data.SCORES && data.SCORES[scoreType]) {
            return data.SCORES[scoreType];
          }
          
          // Try snake_case variants
          const snakeCaseKey = scoreType.replace(/([A-Z])/g, '_$1').toLowerCase();
          if (data.scores && data.scores[snakeCaseKey]) {
            return data.scores[snakeCaseKey];
          }
          if (data.SCORES && data.SCORES[snakeCaseKey]) {
            return data.SCORES[snakeCaseKey];
          }
          
          // Check for direct properties at the root
          if (data[scoreType]) {
            return data[scoreType];
          }
          if (data[snakeCaseKey]) {
            return data[snakeCaseKey];
          }
          
          return fallback;
        };
        
        // Process and normalize the data
        const processedData = {
          ...data,
          // Handle differently structured data
          esgScore: data.esgScore || data.overall_score || 
                   (data.SCORES ? data.SCORES.overall_score : null) || 
                   Math.round((
                     (data.environmentScore || data.global_enviroment_score || (data.SCORES?.global_enviroment_score || 0)) +
                     (data.socialScore || data.global_social_score || (data.SCORES?.global_social_score || 0)) +
                     (data.governanceScore || data.global_governance_score || (data.SCORES?.global_governance_score || 0))
                   ) / 3) || 50,
          
          environmentScore: data.environmentScore || data.global_enviroment_score || 
                           (data.SCORES ? data.SCORES.global_enviroment_score : null) || 50,
          
          socialScore: data.socialScore || data.global_social_score || 
                      (data.SCORES ? data.SCORES.global_social_score : null) || 50,
          
          governanceScore: data.governanceScore || data.global_governance_score || 
                          (data.SCORES ? data.SCORES.global_governance_score : null) || 50,
          
          // Handle report quality
          reportQuality: data.reportQuality || 
                        (data.report_quality ? data.report_quality : 
                         (data.esgScore || data.overall_score || 0) >= 80 ? "Alta" : 
                         (data.esgScore || data.overall_score || 0) >= 60 ? "Media" : "Baja"),
          
          // Handle summary field if it exists in different formats
          summary: typeof data.summary === 'string' ? data.summary : 
                  (data.SUMMARY ? data.SUMMARY : data.CONCLUSION),
          
          // Handle scores sub-scores with improved extraction
          scores: {
            enviroment_scores: data.SCORES?.enviroment_scores || {},
            environmental_scores: {},
            environment_scores: {},
            social_scores: data.SCORES?.social_scores || {},
            governance_scores: data.SCORES?.governance_scores || {},
          },
          
          // Handle law scores
          lawscores: data.lawscores || data.LAWSCORES || [],
          
          // Handle recommendations
          recommendations: data.recommendations || extractRecommendationsFromFeedback(data.FEEDBACK || data.feedback),
          
          // Handle other fields
          feedback: data.feedback || data.FEEDBACK,
          conclusion: data.conclusion || data.CONCLUSION,
          
          // Handle key metrics from summary.resultados
          keyMetrics: data.keyMetrics || {},
          
          // Ensure SUMMARY.resultados is available
          SUMMARY: data.SUMMARY || { resultados: [] }
        }
        
        console.log("Processed report data:", processedData);
        setReport(processedData)
        setError(null)
      } catch (err) {
        console.error("Error fetching report:", err)
        setError("Error al cargar el informe. Por favor, inténtelo de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (report) {
      try {
        // Check all possible locations for the PDF URL
        console.log("Report data for PDF download:", report);
        const pdfUrl = report.SCORES.company_pdf || 
                      (report.SCORES.company_pdf ? report.SCORES.company_pdf : 
                      `/api/process_reports/data/reports/${report.id}/download`);
        
        // For testing/demo purposes - you can remove this line in production
        if (!pdfUrl || pdfUrl === "#") {
          alert("El archivo PDF no está disponible en este momento.");
          return;
        }
        
        // Create an anchor element and trigger the download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${report.company}_ESG_Report_${report.year}.pdf`;
        link.target = "_blank"; // Open in new tab if download fails
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Error downloading PDF:", err);
        alert("Hubo un problema al descargar el archivo. Intente nuevamente más tarde.");
      }
    }
  }

  // Toggle function for showing more/less laws
  const toggleLawsDisplay = () => {
    setShowMoreLaws(!showMoreLaws);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando informe...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (!report) {
    return <div className="p-8 text-center">No se encontró el informe solicitado.</div>
  }

  // Calculate letter grades
  const esgGrade = getLetterGrade(report.esgScore)
  const envGrade = getLetterGrade(report.environmentScore)
  const socialGrade = getLetterGrade(report.socialScore)
  const govGrade = getLetterGrade(report.governanceScore)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{report.company}</h1>
            <div className="flex items-center text-muted-foreground">
              <Tag className="h-3 w-3 mr-1" />
              {report.ticker}
              <span className="mx-2">•</span>
              <Calendar className="h-3 w-3 mr-1" />
              {report.year}
              <span className="mx-2">•</span>
              <Building className="h-3 w-3 mr-1" />
              {report.industry}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={report.websiteUrl || `https://www.${report.company.toLowerCase().replace(/\s+/g, '')}.com`} 
             target="_blank" 
             rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              Visitar sitio web
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Descargar informe
          </Button>
          <Link href={`/compare?company=${report.ticker || report.company}&year=${report.year}`}>
            <Button className="bg-esg-accent hover:bg-esg-accent-dark text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparar
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 gap-1 p-1">
          <TabsTrigger value="overview" className="px-3 py-2">Resumen</TabsTrigger>
          <TabsTrigger value="analysis" className="px-3 py-2">Análisis</TabsTrigger>
          <TabsTrigger value="metrics" className="px-3 py-2">Métricas clave</TabsTrigger>
          <TabsTrigger value="laws" className="px-3 py-2">Cumplimiento legal</TabsTrigger>
          <TabsTrigger value="recommendations" className="px-3 py-2">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Resumen del informe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {preprocessMarkdown(typeof report.summary === 'string' ? report.summary : '')}
                  </ReactMarkdown>
                </div>

                {report.SUMMARY && report.SUMMARY.resultados && report.SUMMARY.resultados.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.SUMMARY.resultados.map((resultado: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="text-xl font-bold">{resultado.valor}</div>
                        <div className="text-sm text-muted-foreground mb-1">{resultado.descripcion}</div>
                        <Badge variant="outline">{resultado.categoria}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {report.strengths && report.strengths.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Fortalezas clave</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {report.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {report.weaknesses && report.weaknesses.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Áreas de mejora</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {report.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puntuación ESG</CardTitle>
                <CardDescription>Puntuaciones generales y por componente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <div className={`text-5xl font-bold mb-2 ${getGradeColor(esgGrade)}`}>
                    {esgGrade}
                  </div>
                  <Badge className={getGradeBackgroundColor(esgGrade)}>
                    {report.esgScore}/100
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-environmental-dark font-medium">Ambiental</span>
                      <span className={`font-medium ${getGradeColor(envGrade)}`}>
                        {envGrade} ({report.environmentScore})
                      </span>
                    </div>
                    <ESGProgress value={report.environmentScore} type="environmental" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-social-dark font-medium">Social</span>
                      <span className={`font-medium ${getGradeColor(socialGrade)}`}>
                        {socialGrade} ({report.socialScore})
                      </span>
                    </div>
                    <ESGProgress value={report.socialScore} type="social" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-governance-dark font-medium">Gobernanza</span>
                      <span className={`font-medium ${getGradeColor(govGrade)}`}>
                        {govGrade} ({report.governanceScore})
                      </span>
                    </div>
                    <ESGProgress value={report.governanceScore} type="governance" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span>Calidad del informe</span>
                    <Badge>{report.reportQuality}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Publicado</span>
                    <span>{new Date(report.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Análisis detallado</CardTitle>
              <CardDescription>Análisis en profundidad del informe ESG por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="environmental">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Leaf className="h-4 w-4 mr-2 text-esg-environmental-dark" />
                      <span className="text-esg-environmental-dark font-medium">Ambiental</span>
                      <Badge className="ml-2" variant="outline">
                        {envGrade} ({report.environmentScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {report.SCORES && report.SCORES.enviroment_scores ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(report.SCORES.enviroment_scores).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="environmental" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      ) : report.scores && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries({
                            ...report.scores.enviroment_scores || {},
                            ...report.scores.environmental_scores || {},
                            ...report.scores.environment_scores || {}
                          }).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="environmental" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="social">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <UsersRound className="h-4 w-4 mr-2 text-esg-social-dark" />
                      <span className="text-esg-social-dark font-medium">Social</span>
                      <Badge className="ml-2" variant="outline">
                        {socialGrade} ({report.socialScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {report.SCORES && report.SCORES.social_scores ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(report.SCORES.social_scores).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="social" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      ) : report.scores && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(report.scores.social_scores || {}).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="social" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="governance">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-esg-governance-dark" />
                      <span className="text-esg-governance-dark font-medium">Gobernanza</span>
                      <Badge className="ml-2" variant="outline">
                        {govGrade} ({report.governanceScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {report.SCORES && report.SCORES.governance_scores ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(report.SCORES.governance_scores).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="governance" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      ) : report.scores && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(report.scores.governance_scores || {}).map(([key, value]: [string, any]) => (
                            <Card key={key}>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">{key}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                                <ESGProgress value={Number(value)} type="governance" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Métricas clave</CardTitle>
              <CardDescription>Indicadores relevantes del informe</CardDescription>
            </CardHeader>
            <CardContent>
              {report.SUMMARY && report.SUMMARY.resultados && report.SUMMARY.resultados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.SUMMARY.resultados.map((resultado: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className={`py-3 ${
                        resultado.categoria === "Social" ? "bg-esg-social/10" :
                        resultado.categoria === "Medioambiente" ? "bg-esg-environmental/10" :
                        "bg-esg-governance/10"
                      }`}>
                        <CardTitle className="text-sm flex items-center">
                          {resultado.categoria === "Social" && <UsersRound className="h-4 w-4 mr-2" />}
                          {resultado.categoria === "Medioambiente" && <Leaf className="h-4 w-4 mr-2" />}
                          {resultado.categoria === "Gobernanza" && <ShieldCheck className="h-4 w-4 mr-2" />}
                          {resultado.categoria}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-xl font-bold">{resultado.valor}</div>
                        <div className="text-sm text-muted-foreground">{resultado.descripcion}</div>
                        {resultado.keywords && resultado.keywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {resultado.keywords.map((keyword: string, kidx: number) => (
                              <Badge key={kidx} variant="outline" className="text-xs">{keyword}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-6">No hay métricas clave disponibles para este informe.</p>
              )}

              {report.keyMetrics && Object.keys(report.keyMetrics).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Otros indicadores</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Métrica</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(report.keyMetrics).map(([key, value]: [string, any]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laws" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Cumplimiento legal</CardTitle>
              <CardDescription>Alineación con normativas relevantes</CardDescription>
            </CardHeader>
            <CardContent>
              {report.lawscores && report.lawscores.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.lawscores.slice(0, 6).map((law: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium">{law.Law}</h3>
                              <progress 
                                className="w-full h-2 mt-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                                value={law.Score * 100}
                                max="100">
                                {Math.round(law.Score * 100)}%
                              </progress>
                            </div>
                            <Badge className="ml-2">{Math.round(law.Score * 100)}%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {report.lawscores.length > 6 && (
                    <>
                      {showMoreLaws && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {report.lawscores.slice(6).map((law: any, index: number) => (
                            <Card key={index + 6}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="font-medium">{law.Law}</h3>
                                    <progress 
                                      className="w-full h-2 mt-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                                      value={law.Score * 100}
                                      max="100">
                                      {Math.round(law.Score * 100)}%
                                    </progress>
                                  </div>
                                  <Badge className="ml-2">{Math.round(law.Score * 100)}%</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={toggleLawsDisplay} 
                        className="w-full mt-4"
                      >
                        {showMoreLaws ? "Ver menos normativas" : "Ver más normativas"}
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay datos de cumplimiento legal disponibles para este informe.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de mejora</CardTitle>
              <CardDescription>Sugerencias para mejorar el desempeño ESG</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Check if there are recommendations OR feedback to show */}
              {((report.recommendations && report.recommendations.length > 0) || report.feedback) ? (
                <div className="space-y-4">
                  {/* Only show feedback section if recommendations weren't extracted from feedback */}
                  {report.feedback && !(report.recommendations && 
                      report.recommendations.length > 0 && 
                      report.recommendations[0] === report.feedback) && (
                    <div className="bg-muted p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Evaluación general</h3>
                      <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {preprocessMarkdown(report.feedback)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {/* Show recommendations if available */}
                  {report.recommendations && report.recommendations.length > 0 && (
                    <ol className="list-decimal pl-5 space-y-4">
                      {report.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="pl-2">
                          <div className="prose dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {preprocessMarkdown(recommendation)}
                            </ReactMarkdown>
                    </div>
                  </li>
                ))}
                    </ol>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay recomendaciones disponibles para este informe.</p>
              )}

              {report.conclusion && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Conclusión final</h3>
                  <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {preprocessMarkdown(report.conclusion)}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

