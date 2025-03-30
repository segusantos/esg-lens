import { CompareForm } from "@/components/compare-form"

export default function ComparePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Comparar informes ESG</h1>
        <p className="text-muted-foreground">Compare informes ESG entre diferentes empresas o períodos de tiempo</p>
      </div>

      <CompareForm />
    </div>
  )
}

