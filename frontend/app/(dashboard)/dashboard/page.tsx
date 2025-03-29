import { ReportsList } from "@/components/reports-list"
import { SearchAndFilters } from "@/components/search-and-filters"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ESG Reports</h1>
        <p className="text-muted-foreground">Search, filter, and analyze ESG reports from various companies</p>
      </div>

      <SearchAndFilters />
      <ReportsList />
    </div>
  )
}

