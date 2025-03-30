"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowUpDown, FileText, BarChart3, Calendar, Building, Tag, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ESGProgress } from "@/components/ui/esg-progress"
import { getLetterGrade, getGradeColor, getGradeBackgroundColor } from "@/lib/score-utils"
import { api, ESGReport } from "@/lib/api"
import { SearchAndFilters } from "./search-and-filters"

export function ReportsList() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [reports, setReports] = useState<ESGReport[]>([])
  const [filteredReports, setFilteredReports] = useState<ESGReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // Used to force refresh

  // Fetch reports from the API
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getReports()
      // Ensure data is always an array
      const reportsArray = Array.isArray(data) ? data : [];
      setReports(reportsArray)
      setFilteredReports(reportsArray)
      setError(null)
    } catch (err) {
      console.error("Error fetching reports:", err)
      setError("Error al cargar los informes. Por favor, inténtelo de nuevo más tarde.")
      // Reset to empty arrays on error
      setReports([])
      setFilteredReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch of reports
  useEffect(() => {
    fetchReports()
  }, [fetchReports, refreshKey])

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Handle filter changes
  const handleFilterChange = useCallback((filters: {
    searchQuery?: string;
    industry?: string;
    year?: number | null;
    minScore?: number | null;
    sortBy?: string;
  }) => {
    // Ensure reports is an array
    if (!Array.isArray(reports)) {
      console.warn('Reports is not an array:', reports)
      setFilteredReports([])
      return
    }
    
    let filtered = [...reports]

    // Apply search filter
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(report => 
        report.company.toLowerCase().includes(search) || 
        report.ticker.toLowerCase().includes(search)
      )
    }

    // Apply industry filter
    if (filters.industry && filters.industry !== "all") {
      filtered = filtered.filter(report => report.industry === filters.industry)
    }

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(report => report.year === filters.year)
    }

    // Apply min score filter
    if (filters.minScore !== null && filters.minScore !== undefined) {
      filtered = filtered.filter(report => report.esgScore >= filters.minScore!)
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = sortReports(filtered, filters.sortBy)
    }

    setFilteredReports(filtered)
  }, [reports])

  // Sort reports based on sort option
  const sortReports = (reportsToSort: ESGReport[], sortOption: string) => {
    const sorted = [...reportsToSort]
    
    switch (sortOption) {
      case "date-desc":
        return sorted.sort((a, b) => b.year - a.year)
      case "date-asc":
        return sorted.sort((a, b) => a.year - b.year)
      case "company-asc":
        return sorted.sort((a, b) => a.company.localeCompare(b.company))
      case "company-desc":
        return sorted.sort((a, b) => b.company.localeCompare(a.company))
      case "score-desc":
        return sorted.sort((a, b) => b.SCORES.overall_score - a.SCORES.overall_score)
      case "score-asc":
        return sorted.sort((a, b) => a.SCORES.overall_score - b.SCORES.overall_score)
      default:
        return sorted
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando informes...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  // Ensure filteredReports is an array before rendering
  const reportsToDisplay = Array.isArray(filteredReports) ? filteredReports : [];

  return (
    <div className="space-y-4">
      <SearchAndFilters onFilterChange={handleFilterChange} />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {reportsToDisplay.length} {reportsToDisplay.length === 1 ? "informe encontrado" : "informes encontrados"}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-none"
            >
              Tarjetas
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none"
            >
              Tabla
            </Button>
          </div>
        </div>
      </div>

      {reportsToDisplay.length === 0 ? (
        <div className="p-8 text-center">No se encontraron informes que coincidan con los criterios seleccionados.</div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportsToDisplay.map((report) => {
            console.log("Report:", report)
            const esgGrade = getLetterGrade(report.SCORES.overall_score)
            const envGrade = getLetterGrade(report.SCORES.global_enviroment_score)
            const socialGrade = getLetterGrade(report.SCORES.global_social_score)
            const govGrade = getLetterGrade(report.SCORES.global_governance_score)

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
                        <span className="text-esg-environmental-dark font-medium">Ambiental</span>
                        <span className={`font-medium ${getGradeColor(envGrade)}`}>{envGrade}</span>
                      </div>
                      <ESGProgress value={report.SCORES.global_enviroment_score} type="environmental" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-esg-social-dark font-medium">Social</span>
                        <span className={`font-medium ${getGradeColor(socialGrade)}`}>{socialGrade}</span>
                      </div>
                      <ESGProgress value={report.SCORES.global_social_score} type="social" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-esg-governance-dark font-medium">Gobernanza</span>
                        <span className={`font-medium ${getGradeColor(govGrade)}`}>{govGrade}</span>
                      </div>
                      <ESGProgress value={report.SCORES.global_governance_score} type="governance" />
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
                      Ver Detalles
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
                <TableHead>Empresa</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Industria</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Calificación ESG
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Calidad</TableHead>
                <TableHead>Fecha de Publicación</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsToDisplay.map((report) => {
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
                    <TableCell>{report.reportQuality || "Media"}</TableCell>
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

