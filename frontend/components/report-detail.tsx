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
              Visit Website
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Link href={`/compare?company=${report.ticker}&year=${report.year}`}>
            <Button className="bg-esg-accent hover:bg-esg-accent-dark text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{report.summary}</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Key Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
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
                <CardTitle>ESG Score</CardTitle>
                <CardDescription>Overall and component scores</CardDescription>
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
                      <span className="text-esg-environmental-dark font-medium">Environmental</span>
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
                      <span className="text-esg-governance-dark font-medium">Governance</span>
                      <span className={`font-medium ${getGradeColor(getLetterGrade(report.governanceScore))}`}>
                        {getLetterGrade(report.governanceScore)} ({report.governanceScore})
                      </span>
                    </div>
                    <ESGProgress value={report.governanceScore} type="governance" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span>Report Quality</span>
                    <Badge>{report.reportQuality}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Published</span>
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
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>In-depth analysis of the ESG report by category</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="environmental">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="text-esg-environmental-dark font-medium">Environmental</span>
                      <Badge className="ml-2" variant="outline">
                        {getLetterGrade(report.environmentScore)} ({report.environmentScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>
                        Green Energy Corp demonstrates strong environmental performance with comprehensive reporting on
                        emissions, energy usage, and waste management. The company has set science-based targets for
                        carbon reduction and is making significant progress toward its goals.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Highlights:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>15% year-over-year reduction in carbon emissions</li>
                          <li>78% of energy consumption from renewable sources</li>
                          <li>85% waste recycling rate</li>
                          <li>Comprehensive climate risk assessment</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Water usage reporting lacks specific reduction targets</li>
                          <li>Scope 3 emissions reporting could be more comprehensive</li>
                          <li>Limited disclosure on biodiversity impacts</li>
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
                        The company provides strong disclosure on workforce diversity, employee development, and
                        community engagement. There is a clear commitment to creating an inclusive workplace and
                        supporting local communities.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Highlights:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>42% women in leadership positions</li>
                          <li>Comprehensive diversity and inclusion programs</li>
                          <li>$4.5 million invested in community programs</li>
                          <li>Strong health and safety performance</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Limited quantitative metrics for community impact</li>
                          <li>Supply chain human rights assessment could be more detailed</li>
                          <li>Employee satisfaction metrics not fully disclosed</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="governance">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="text-esg-governance-dark font-medium">Governance</span>
                      <Badge className="ml-2" variant="outline">
                        {getLetterGrade(report.governanceScore)} ({report.governanceScore})
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>
                        Green Energy Corp demonstrates robust governance practices with a strong board structure, clear
                        ESG oversight, and transparent reporting. The company has integrated ESG metrics into executive
                        compensation.
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Highlights:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>75% independent directors on the board</li>
                          <li>Dedicated sustainability committee at board level</li>
                          <li>ESG metrics account for 25% of executive compensation</li>
                          <li>Comprehensive ethics and compliance program</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>More detailed disclosure on lobbying activities</li>
                          <li>Tax transparency could be enhanced</li>
                          <li>Cybersecurity governance reporting is limited</li>
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
              <CardTitle>Key ESG Metrics</CardTitle>
              <CardDescription>Quantitative metrics extracted from the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4 text-esg-environmental-dark">Environmental Metrics</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Carbon Emissions:</span>
                      <span className="font-medium">{report.keyMetrics.carbonEmissions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Renewable Energy:</span>
                      <span className="font-medium">{report.keyMetrics.renewableEnergy}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Water Usage:</span>
                      <span className="font-medium">{report.keyMetrics.waterUsage}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Waste Recycled:</span>
                      <span className="font-medium">{report.keyMetrics.wasteRecycled}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-esg-social-dark">Social Metrics</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Employee Turnover:</span>
                      <span className="font-medium">{report.keyMetrics.employeeTurnover}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Diversity Score:</span>
                      <span className="font-medium">{report.keyMetrics.diversityScore}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Community Investment:</span>
                      <span className="font-medium">{report.keyMetrics.communityInvestment}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-esg-governance-dark">Governance Metrics</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Board Independence:</span>
                      <span className="font-medium">{report.keyMetrics.boardIndependence}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Executive Pay:</span>
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
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggested improvements for future ESG reporting and performance</CardDescription>
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

