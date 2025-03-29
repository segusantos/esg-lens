"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) return

    setIsUploading(true)

    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false)
      setUploadComplete(true)
    }, 2000)

    // In a real application, you would send the file to your Python backend
    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('company', companyName)
    // formData.append('year', year)
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Enter the details of the ESG report you want to upload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="e.g. Green Energy Corp" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input id="ticker" placeholder="e.g. GEC" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Company Website</Label>
            <Input id="website" type="url" placeholder="e.g. https://www.greenenergycorp.com" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Report Year</Label>
              <Select defaultValue="2023">
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
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
              <Label htmlFor="industry">Industry</Label>
              <Select defaultValue="energy">
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="consumer">Consumer Goods</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload PDF Report</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              {file ? (
                <div className="text-center">
                  <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                    Change file
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="mb-1 font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground mb-4">Supports PDF files up to 20MB</p>
                  <Button type="button" variant="outline" asChild>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      Browse files
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
                Processing...
              </>
            ) : uploadComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Upload Complete
              </>
            ) : (
              "Upload and Analyze"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

