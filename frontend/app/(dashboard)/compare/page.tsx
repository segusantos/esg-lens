import { CompareForm } from "@/components/compare-form"

export default function ComparePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Compare ESG Reports</h1>
        <p className="text-muted-foreground">Compare ESG reports between different companies or time periods</p>
      </div>

      <CompareForm />
    </div>
  )
}

