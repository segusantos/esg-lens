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
          <TabsTrigger value="companies">Different Companies</TabsTrigger>
          <TabsTrigger value="years">Time Periods</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compare Companies</CardTitle>
              <CardDescription>Compare ESG reports between two different companies for the same year</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">First Company</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
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
                  <h3 className="text-sm font-medium">Second Company</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
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
                <h3 className="text-sm font-medium">Report Year</h3>
                <Select defaultValue="2023">
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
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
                {isComparing ? "Comparing..." : "Compare Reports"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="years" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compare Time Periods</CardTitle>
              <CardDescription>Compare ESG reports for the same company across different years</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Company</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
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
                  <h3 className="text-sm font-medium">First Year</h3>
                  <Select defaultValue="2023">
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
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
                  <h3 className="text-sm font-medium">Second Year</h3>
                  <Select defaultValue="2022">
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
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
                {isComparing ? "Comparing..." : "Compare Reports"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {showResults && <ComparisonResults type={comparisonType} />}
    </div>
  )
}

