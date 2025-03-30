"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Check, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UploadForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [company, setCompany] = useState("")
  const [ticker, setTicker] = useState("")
  const [website, setWebsite] = useState("")
  const [year, setYear] = useState("2023")
  const [industry, setIndustry] = useState("Energía")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null) // Clear any previous errors
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Por favor, seleccione un archivo PDF para cargar.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create form data to send to the backend
      const formData = new FormData()
      formData.append('file', file)
      formData.append('company', company)
      formData.append('year', year)
      formData.append('industry', industry)
      
      // Optional fields
      if (ticker) formData.append('ticker', ticker)
      if (website) formData.append('website_url', website)

      // Send to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/pdf`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Error al procesar el archivo PDF")
      }

      const data = await response.json()
      
      // Handle successful upload
      setUploadComplete(true)
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset()
      }
      setFile(null)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh() // Force refresh to update the reports list
      }, 2000)

    } catch (err: any) {
      console.error("Error uploading file:", err)
      setError(err.message || "Ocurrió un error al cargar el archivo. Inténtelo de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Detalles del informe</CardTitle>
          <CardDescription>Ingrese los detalles del informe ESG que desea cargar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la empresa</Label>
              <Input 
                id="company" 
                placeholder="ej. Energía Verde S.A." 
                required 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticker">Símbolo bursátil</Label>
              <Input 
                id="ticker" 
                placeholder="ej. EVR" 
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio web de la empresa</Label>
            <Input 
              id="website" 
              type="url" 
              placeholder="ej. https://www.energiaverde.com" 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año del informe</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industria</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Seleccionar industria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Energía">Energía</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Finanzas">Finanzas</SelectItem>
                  <SelectItem value="Healthcare">Salud</SelectItem>
                  <SelectItem value="Bienes de Consumo">Bienes de Consumo</SelectItem>
                  <SelectItem value="Otra">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Cargar informe PDF</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              {file ? (
                <div className="text-center">
                  <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="mb-1 font-medium">Arrastre y suelte su archivo aquí</p>
                  <p className="text-sm text-muted-foreground mb-4">Admite archivos PDF de hasta 20MB</p>
                  <Button type="button" variant="outline" asChild>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      Buscar archivos
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </Label>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-esg-accent hover:bg-esg-accent-dark text-white"
            disabled={!file || isUploading || uploadComplete}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : uploadComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Carga completada
              </>
            ) : (
              "Cargar y analizar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

