import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upload ESG Report</h1>
        <p className="text-muted-foreground">Upload a new ESG report PDF to analyze and add to the database</p>
      </div>

      <UploadForm />
    </div>
  )
}

