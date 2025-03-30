import { ReportsList } from "@/components/reports-list"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Informes ESG</h1>
        <p className="text-muted-foreground">Busque, filtre y analice informes ESG de varias empresas</p>
      </div>

      <ReportsList />
    </div>
  )
}

