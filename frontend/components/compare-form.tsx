"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComparisonResults } from "@/components/comparison-results"
import { api } from "@/lib/api"

export function CompareForm() {
  const [comparisonType, setComparisonType] = useState("companies")
  const [isComparing, setIsComparing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [companies, setCompanies] = useState<Array<{id: string, ticker: string, company: string}>>([])
  const [years, setYears] = useState<Array<number>>([])
  const [loading, setLoading] = useState(true)
  
  // Form values
  const [company1, setCompany1] = useState<string>("")
  const [company2, setCompany2] = useState<string>("")
  const [companyForYears, setCompanyForYears] = useState<string>("")
  const [year, setYear] = useState<string>("")
  const [year1, setYear1] = useState<string>("")
  const [year2, setYear2] = useState<string>("")
  
  // Comparison results
  const [comparisonData, setComparisonData] = useState<any>(null)

  // Fetch available companies and years
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        // Get all reports
        const reports = await api.getReports()
        
        // Extract unique companies
        const uniqueCompanies: {[key: string]: {id: string, ticker: string, company: string}} = {}
        
        // Extract unique years
        const uniqueYears = new Set<number>()
        
        if (Array.isArray(reports)) {
          reports.forEach(report => {
            // Add company if not already in the set
            if (report.company && !uniqueCompanies[report.company]) {
              uniqueCompanies[report.company] = {
                id: report.id,
                ticker: report.ticker || "",
                company: report.company
              }
            }
            
            // Add year to set
            if (report.year) {
              uniqueYears.add(report.year)
            }
          })
          
          // Convert to arrays and sort
          setCompanies(Object.values(uniqueCompanies).sort((a, b) => a.company.localeCompare(b.company)))
          setYears(Array.from(uniqueYears).sort((a, b) => b - a)) // Sort years descending
        }
      } catch (error) {
        console.error("Error fetching comparison options:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOptions()
  }, [])

  const handleCompare = async () => {
    setIsComparing(true)
    
    try {
      let comparisonParams = {}
      
      if (comparisonType === "companies") {
        comparisonParams = {
          company1,
          company2,
          year
        }
      } else {
        comparisonParams = {
          company: companyForYears,
          year1,
          year2
        }
      }
      
      // Call the API to get comparison results
      const data = await api.compareReports(comparisonParams)
      console.log("Comparison data:", data)
      setComparisonData(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error comparing reports:", error)
      // Handle error
    } finally {
      setIsComparing(false)
    }
  }

  const isCompareDisabled = () => {
    if (comparisonType === "companies") {
      return !company1 || !company2 || !year || isComparing || company1 === company2
    } else {
      return !companyForYears || !year1 || !year2 || isComparing || year1 === year2
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="companies" onValueChange={setComparisonType}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="companies">Diferentes empresas</TabsTrigger>
          <TabsTrigger value="years">Períodos de tiempo</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparar empresas</CardTitle>
              <CardDescription>Compare informes ESG entre dos empresas diferentes para el mismo año</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Primera empresa</h3>
                  <Select value={company1} onValueChange={setCompany1}>
                    <SelectTrigger disabled={loading}>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.ticker || company.company}>
                          {company.company} {company.ticker ? `(${company.ticker})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Segunda empresa</h3>
                  <Select value={company2} onValueChange={setCompany2}>
                    <SelectTrigger disabled={loading}>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.ticker || company.company}>
                          {company.company} {company.ticker ? `(${company.ticker})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Año del informe</h3>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleCompare} 
                disabled={isCompareDisabled()}
              >
                {isComparing ? "Comparando..." : "Comparar informes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="years" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparar períodos de tiempo</CardTitle>
              <CardDescription>Compare informes ESG para la misma empresa en diferentes años</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Empresa</h3>
                <Select value={companyForYears} onValueChange={setCompanyForYears}>
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.ticker || company.company}>
                        {company.company} {company.ticker ? `(${company.ticker})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Primer año</h3>
                  <Select value={year1} onValueChange={setYear1}>
                    <SelectTrigger disabled={loading}>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Segundo año</h3>
                  <Select value={year2} onValueChange={setYear2}>
                    <SelectTrigger disabled={loading}>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleCompare} 
                disabled={isCompareDisabled()}
              >
                {isComparing ? "Comparando..." : "Comparar informes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {showResults && <ComparisonResults type={comparisonType} data={comparisonData} />}
    </div>
  )
}

