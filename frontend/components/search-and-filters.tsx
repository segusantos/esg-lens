"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function SearchAndFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")

  const years = ["All Years", "2023", "2022", "2021", "2020", "2019"]

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by company name or ticker..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="company-asc">Company (A-Z)</SelectItem>
            <SelectItem value="company-desc">Company (Z-A)</SelectItem>
            <SelectItem value="score-desc">Highest Score</SelectItem>
            <SelectItem value="score-asc">Lowest Score</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Filter ESG reports by various criteria</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Year</h3>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <Button key={year} variant="outline" size="sm" className="rounded-full">
                      {year}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Industry</h3>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consumer">Consumer Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">ESG Score Range</h3>
                <div className="flex items-center space-x-2">
                  <Input type="number" placeholder="Min" className="w-20" />
                  <span>to</span>
                  <Input type="number" placeholder="Max" className="w-20" />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

