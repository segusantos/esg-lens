"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComparisonResults } from "@/components/comparison-results"

export function CompareForm() {
  const [comparisonType, setComparisonType] = useState("companies")
  const [isComparing, setIsComparing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleCompare = () => {
    setIsComparing(true)

    // Simulate API call
    setTimeout(() => {
      setIsComparing(false)
      setShowResults(true)
    }, 1500)
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gec">Green Energy Corp (GEC)</SelectItem>
                      <SelectItem value="tii">Tech Innovations Inc (TII)</SelectItem>
                      <SelectItem value="gfg">Global Finance Group (GFG)</SelectItem>
                      <SelectItem value="hcs">Healthcare Solutions (HCS)</SelectItem>
                      <SelectItem value="cgl">Consumer Goods Ltd (CGL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Segunda empresa</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gec">Green Energy Corp (GEC)</SelectItem>
                      <SelectItem value="tii">Tech Innovations Inc (TII)</SelectItem>
                      <SelectItem value="gfg">Global Finance Group (GFG)</SelectItem>
                      <SelectItem value="hcs">Healthcare Solutions (HCS)</SelectItem>
                      <SelectItem value="cgl">Consumer Goods Ltd (CGL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Año del informe</h3>
                <Select defaultValue="2023">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCompare} disabled={isComparing}>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gec">Green Energy Corp (GEC)</SelectItem>
                    <SelectItem value="tii">Tech Innovations Inc (TII)</SelectItem>
                    <SelectItem value="gfg">Global Finance Group (GFG)</SelectItem>
                    <SelectItem value="hcs">Healthcare Solutions (HCS)</SelectItem>
                    <SelectItem value="cgl">Consumer Goods Ltd (CGL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Primer año</h3>
                  <Select defaultValue="2023">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Segundo año</h3>
                  <Select defaultValue="2022">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCompare} disabled={isComparing}>
                {isComparing ? "Comparando..." : "Comparar informes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {showResults && <ComparisonResults type={comparisonType} />}
    </div>
  )
}

