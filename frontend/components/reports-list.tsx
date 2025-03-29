"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, FileText, BarChart3, Calendar, Building, Tag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
  },
  {
    id: "2",
    company: "Tech Innovations Inc",
    ticker: "TII",
    year: 2023,
    industry: "Technology",
    esgScore: 78,
    environmentScore: 72,
    socialScore: 81,
    governanceScore: 82,
    reportQuality: "Medium",
    publishDate: "2023-03-22",
    fileUrl: "#",
  },
  {
    id: "3",
    company: "Global Finance Group",
    ticker: "GFG",
    year: 2022,
    industry: "Finance",
    esgScore: 75,
    environmentScore: 68,
    socialScore: 79,
    governanceScore: 80,
    reportQuality: "Medium",
    publishDate: "2022-05-10",
    fileUrl: "#",
  },
  {
    id: "4",
    company: "Healthcare Solutions",
    ticker: "HCS",
    year: 2023,
    industry: "Healthcare",
    esgScore: 82,
    environmentScore: 79,
    socialScore: 86,
    governanceScore: 81,
    reportQuality: "High",
    publishDate: "2023-02-28",
    fileUrl: "#",
  },
  {
    id: "5",
    company: "Consumer Goods Ltd",
    ticker: "CGL",
    year: 2022,
    industry: "Consumer Goods",
    esgScore: 71,
    environmentScore: 74,
    socialScore: 68,
    governanceScore: 72,
    reportQuality: "Medium",
    publishDate: "2022-06-15",
    fileUrl: "#",
  },
]

export function ReportsList() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="rounded-none"
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="rounded-none"
          >
            Table
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockReports.map((report) => {
            const esgGrade = getLetterGrade(report.esgScore)
            const envGrade = getLetterGrade(report.environmentScore)
            const socialGrade = getLetterGrade(report.socialScore)
            const govGrade = getLetterGrade(report.governanceScore)

            return (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{report.company}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Tag className="h-3 w-3 mr-1" />
                        {report.ticker}
                        <span className="mx-2">•</span>
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.year}
                      </CardDescription>
                    </div>
                    <Badge className={`text-lg font-bold ${getGradeBackgroundColor(esgGrade)}`}>{esgGrade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-esg-environmental-dark font-medium">Environmental</span>
                        <span className={`font-medium ${getGradeColor(envGrade)}`}>{envGrade}</span>
                      </div>
                      <ESGProgress value={report.environmentScore} type="environmental" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-esg-social-dark font-medium">Social</span>
                        <span className={`font-medium ${getGradeColor(socialGrade)}`}>{socialGrade}</span>
                      </div>
                      <ESGProgress value={report.socialScore} type="social" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-esg-governance-dark font-medium">Governance</span>
                        <span className={`font-medium ${getGradeColor(govGrade)}`}>{govGrade}</span>
                      </div>
                      <ESGProgress value={report.governanceScore} type="governance" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    <Building className="h-3 w-3 inline mr-1" />
                    {report.industry}
                  </div>
                  <Link href={`/reports/${report.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    ESG Grade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Report Quality</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => {
                const esgGrade = getLetterGrade(report.esgScore)

                return (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">{report.company}</div>
                      <div className="text-sm text-muted-foreground">{report.ticker}</div>
                    </TableCell>
                    <TableCell>{report.year}</TableCell>
                    <TableCell>{report.industry}</TableCell>
                    <TableCell>
                      <Badge className={getGradeBackgroundColor(esgGrade)}>{esgGrade}</Badge>
                    </TableCell>
                    <TableCell>{report.reportQuality}</TableCell>
                    <TableCell>{report.publishDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Link href={`/reports/${report.id}`}>
                          <Button variant="ghost" size="icon">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

