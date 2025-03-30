"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { api } from "@/lib/api"

// Define the props interface with a search callback
interface SearchAndFiltersProps {
  onFilterChange: (filters: {
    searchQuery?: string;
    industry?: string;
    year?: number | null;
    minScore?: number | null;
    sortBy?: string;
  }) => void;
}

export function SearchAndFilters({ onFilterChange }: SearchAndFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [industry, setIndustry] = useState<string | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [minScore, setMinScore] = useState<number | null>(null)
  const [maxScore, setMaxScore] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("date-desc")

  const years = ["Todos los años", "2025", "2024", "2023", "2022", "2021", "2020", "2019"]

  // Apply filters when any filter changes
  useEffect(() => {
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      onFilterChange({
        searchQuery,
        industry,
        year: selectedYear,
        minScore,
        sortBy
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, industry, selectedYear, minScore, sortBy, onFilterChange]);

  // Handle year selection
  const handleYearClick = (year: string) => {
    if (year === "Todos los años") {
      setSelectedYear(null);
    } else {
      setSelectedYear(parseInt(year));
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery("");
    setIndustry(undefined);
    setSelectedYear(null);
    setMinScore(null);
    setMaxScore(null);
    setSortBy("date-desc");
    onFilterChange({});
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange({
      searchQuery,
      industry,
      year: selectedYear,
      minScore,
      sortBy
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre o ticker de empresa..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Más recientes</SelectItem>
            <SelectItem value="date-asc">Más antiguos</SelectItem>
            <SelectItem value="company-asc">Empresa (A-Z)</SelectItem>
            <SelectItem value="company-desc">Empresa (Z-A)</SelectItem>
            <SelectItem value="score-desc">Mayor puntuación</SelectItem>
            <SelectItem value="score-asc">Menor puntuación</SelectItem>
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
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Filtrar informes ESG por varios criterios</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Año</h3>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <Button 
                      key={year} 
                      variant={selectedYear === (year === "Todos los años" ? null : parseInt(year)) ? "default" : "outline"} 
                      size="sm" 
                      className="rounded-full"
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Industria</h3>
                <Select 
                  value={industry} 
                  onValueChange={setIndustry}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar industria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las industrias</SelectItem>
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                    <SelectItem value="Energía">Energía</SelectItem>
                    <SelectItem value="Finanzas">Finanzas</SelectItem>
                    <SelectItem value="Healthcare">Salud</SelectItem>
                    <SelectItem value="Bienes de Consumo">Bienes de Consumo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Rango de puntuación ESG</h3>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Mín" 
                    className="w-20" 
                    value={minScore || ""}
                    onChange={(e) => setMinScore(e.target.value ? parseInt(e.target.value) : null)}
                    min={0}
                    max={100}
                  />
                  <span>a</span>
                  <Input 
                    type="number" 
                    placeholder="Máx" 
                    className="w-20" 
                    value={maxScore || ""}
                    onChange={(e) => setMaxScore(e.target.value ? parseInt(e.target.value) : null)}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleReset}>Restablecer</Button>
              <Button onClick={handleApplyFilters}>Aplicar filtros</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

