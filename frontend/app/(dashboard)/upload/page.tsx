import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cargar informe ESG</h1>
        <p className="text-muted-foreground">Cargue un nuevo PDF de informe ESG para analizar y agregar a la base de datos</p>
      </div>

      <UploadForm />
    </div>
  )
}

