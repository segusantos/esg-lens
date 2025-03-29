// API client for connecting to the Python backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ESGReport {
  id: string
  company: string
  ticker: string
  year: number
  industry: string
  esgScore: number
  esgGrade: string
  environmentScore: number
  environmentGrade: string
  socialScore: number
  socialGrade: string
  governanceScore: number
  governanceGrade: string
  reportQuality: string
  publishDate: string
  fileUrl: string
  websiteUrl: string
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  keyMetrics: Record<string, string>
}

export interface ReportFilters {
  search?: string
  year?: number
  industry?: string
  sortBy?: string
}

// Get all reports with optional filtering
export async function getReports(filters: ReportFilters = {}): Promise<ESGReport[]> {
  const queryParams = new URLSearchParams()

  if (filters.search) queryParams.append("search", filters.search)
  if (filters.year) queryParams.append("year", filters.year.toString())
  if (filters.industry) queryParams.append("industry", filters.industry)
  if (filters.sortBy) queryParams.append("sort_by", filters.sortBy)

  const response = await fetch(`${API_BASE_URL}/reports?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch reports")
  }

  return response.json()
}

// Get a single report by ID
export async function getReport(id: string): Promise<ESGReport> {
  const response = await fetch(`${API_BASE_URL}/reports/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch report")
  }

  return response.json()
}

// Upload a new report
export async function uploadReport(formData: FormData): Promise<ESGReport> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload report")
  }

  return response.json()
}

// Compare reports
export interface ComparisonParams {
  company1?: string
  company2?: string
  year1?: number
  year2?: number
}

export interface ComparisonResult {
  type: "companies" | "years"
  report1: ESGReport
  report2: ESGReport
}

export async function compareReports(params: ComparisonParams): Promise<ComparisonResult> {
  const queryParams = new URLSearchParams()

  if (params.company1) queryParams.append("company1", params.company1)
  if (params.company2) queryParams.append("company2", params.company2)
  if (params.year1) queryParams.append("year1", params.year1.toString())
  if (params.year2) queryParams.append("year2", params.year2.toString())

  const response = await fetch(`${API_BASE_URL}/compare?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to compare reports")
  }

  return response.json()
}

