"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Update the imports to include our new ESGProgress component
import { ESGProgress } from "@/components/ui/esg-progress"
import { getLetterGrade, getGradeColor, getGradeBackgroundColor } from "@/lib/score-utils"

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

export function ReportDetail({ id }: ReportDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Find the report with the matching ID
  const report = mockReports.find((r) => r.id === id) || mockReports[0]

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
          <a href={report.websiteUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              Visitar sitio web
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar informe
          </Button>
          <Link href={`/compare?company=${report.ticker}&year=${report.year}`}>
            <Button className="bg-esg-accent hover:bg-esg-accent-dark text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparar
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="metrics">Métricas clave</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Resumen del informe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{report.summary}</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Fortalezas clave</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Áreas de mejora</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
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
                  <div className={`text-5xl font-bold mb-2 ${getGradeColor(getLetterGrade(report.esgScore))}`}>
                    {getLetterGrade(report.esgScore)}
                  </div>
                  <Badge className={getGradeBackgroundColor(getLetterGrade(report.esgScore))}>
                    {report.esgScore}/100
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-environmental-dark font-medium">Ambiental</span>
                      <span className={`font-medium ${getGradeColor(getLetterGrade(report.environmentScore))}`}>
                        {getLetterGrade(report.environmentScore)} ({report.environmentScore})
                      </span>
                    </div>
                    <ESGProgress value={report.environmentScore} type="environmental" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-social-dark font-medium">Social</span>
                      <span className={`font-medium ${getGradeColor(getLetterGrade(report.socialScore))}`}>
                        {getLetterGrade(report.socialScore)} ({report.socialScore})
                      </span>
                    </div>
                    <ESGProgress value={report.socialScore} type="social" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-esg-governance-dark font-medium">Gobernanza</span>
                      <span className={`font-medium ${getGradeColor(getLetterGrade(report.governanceScore))}`}>
                        {getLetterGrade(report.governanceScore)} ({report.governanceScore})
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
                    <span>{report.publishDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
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
                      <span className="text-esg-environmental-dark font-medium">Ambiental</span>
                      <Badge className="ml-2" variant="outline">
                        {getLetterGrade(report.environmentScore)} ({report.environmentScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>
                        Green Energy Corp demuestra un fuerte desempeño ambiental con informes completos sobre
                        emisiones, uso de energía y gestión de residuos. La empresa ha establecido objetivos basados en la ciencia para
                        reducción de carbono y está avanzando significativamente hacia sus metas.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Resaltes:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Reducción del 15% respecto al año anterior en emisiones de carbono</li>
                          <li>78% del consumo de energía procedente de fuentes renovables</li>
                          <li>85% de tasa de reciclaje de residuos</li>
                          <li>Evaluación de riesgos climáticos integral</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Áreas para mejorar:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Reporte de uso de agua sin objetivos de reducción específicos</li>
                          <li>Reporte de emisiones de Scope 3 podría ser más completo</li>
                          <li>Menos detalles sobre impactos de biodiversidad</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="social">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="text-esg-social-dark font-medium">Social</span>
                      <Badge className="ml-2" variant="outline">
                        {getLetterGrade(report.socialScore)} ({report.socialScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>
                        La empresa proporciona una buena divulgación sobre diversidad de personal, desarrollo de empleados y
                        participación comunitaria. Hay un compromiso claro para crear un lugar de trabajo inclusivo y
                        apoyar a las comunidades locales.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Resaltes:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>42% mujeres en posiciones de liderazgo</li>
                          <li>Programas de diversidad y inclusión completos</li>
                          <li>$4.5 millones invertidos en programas comunitarios</li>
                          <li>Buen rendimiento en salud y seguridad</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Áreas para mejorar:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Poca métrica cuantitativa para impacto comunitario</li>
                          <li>Evaluación de derechos humanos de cadena de suministro podría ser más detallada</li>
                          <li>Métricas de satisfacción del empleado no divulgadas por completo</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="governance">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="text-esg-governance-dark font-medium">Gobernanza</span>
                      <Badge className="ml-2" variant="outline">
                        {getLetterGrade(report.governanceScore)} ({report.governanceScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>
                        Green Energy Corp demuestra prácticas sólidas de gobernanza con una estructura robusta de directorio, 
                        control de ESG y divulgación transparente. La empresa ha integrado métricas de ESG en la compensación de ejecutivos.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Resaltes:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>75% directores independientes en el directorio</li>
                          <li>Comité de cumplimiento de la sostenibilidad a nivel de directorio</li>
                          <li>Métricas de ESG representan el 25% de la compensación de ejecutivos</li>
                          <li>Programa de ética y cumplimiento integral</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Áreas para mejorar:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Más divulgación detallada sobre actividades de lobby</li>
                          <li>Transparencia fiscal podría mejorarse</li>
                          <li>Los informes de gobernanza de ciberseguridad son limitados</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Métricas ESG clave</CardTitle>
              <CardDescription>Métricas cuantitativas extraídas del informe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4 text-esg-environmental-dark">Métricas Ambientales</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Emisiones de carbono:</span>
                      <span className="font-medium">{report.keyMetrics.carbonEmissions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Energía renovable:</span>
                      <span className="font-medium">{report.keyMetrics.renewableEnergy}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Uso de agua:</span>
                      <span className="font-medium">{report.keyMetrics.waterUsage}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Residuos reciclados:</span>
                      <span className="font-medium">{report.keyMetrics.wasteRecycled}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-esg-social-dark">Métricas Sociales</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Rotación de empleados:</span>
                      <span className="font-medium">{report.keyMetrics.employeeTurnover}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Puntuación de diversidad:</span>
                      <span className="font-medium">{report.keyMetrics.diversityScore}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Inversión comunitaria:</span>
                      <span className="font-medium">{report.keyMetrics.communityInvestment}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-esg-governance-dark">Métricas de Gobernanza</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Independencia del directorio:</span>
                      <span className="font-medium">{report.keyMetrics.boardIndependence}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Pago a ejecutivos:</span>
                      <span className="font-medium">{report.keyMetrics.executivePay}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
              <CardDescription>Mejoras sugeridas para futuros informes y desempeño ESG</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                      <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <p>{recommendation}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

