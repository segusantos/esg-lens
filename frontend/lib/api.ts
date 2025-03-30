// API client for connecting to the Python backend

import axios from 'axios';
import { assert } from 'node:console';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ESGReport {
  id: string;
  company: string;
  ticker: string;
  year: number;
  industry: string;
  esg_score: number;
  environment_score: number;
  social_score: number;
  governance_score: number;
  report_quality: string;
  publish_date: string;
  file_url: string;
  website_url?: string;
  summary?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  key_metrics?: Record<string, string>;
}

export interface ReportFilters {
  search?: string;
  year?: number;
  industry?: string;
  sortBy?: string;
}

// Get all reports with optional filtering
export async function getReports(filters: ReportFilters = {}): Promise<ESGReport[]> {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.year) queryParams.append("year", filters.year.toString());
  if (filters.industry) queryParams.append("industry", filters.industry);
  if (filters.sortBy) queryParams.append("sort_by", filters.sortBy);

  const response = await fetch(`${API_URL}/reports?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}

// Get a single report by ID
export async function getReport(id: string): Promise<ESGReport> {
  const response = await fetch(`${API_URL}/reports/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch report");
  }

  return response.json();
}

// Upload a new report
export async function uploadReport(formData: FormData): Promise<ESGReport> {
  const response = await fetch(`${API_URL}/reports`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload report");
  }

  return response.json();
}

// Compare reports
export interface ComparisonParams {
  company1?: string;
  company2?: string;
  company?: string;
  year?: string;
  year1?: string;
  year2?: string;
}

export interface ComparisonResult {
  type: "companies" | "years";
  report1: ESGReport;
  report2: ESGReport;
}

export async function compareReports(params: ComparisonParams): Promise<ComparisonResult> {
  const queryParams = new URLSearchParams();

  if (params.company1) queryParams.append("company1", params.company1);
  if (params.company2) queryParams.append("company2", params.company2);
  if (params.company) queryParams.append("company", params.company);
  if (params.year) queryParams.append("year", params.year);
  if (params.year1) queryParams.append("year1", params.year1);
  if (params.year2) queryParams.append("year2", params.year2);

  try {
    const response = await fetch(`${API_URL}/compare?${queryParams.toString()}`);

    if (!response.ok) {
      // If the backend comparison fails, we'll manually simulate the comparison using individual reports
      if (params.company1 && params.company2 && params.year) {
        // Compare two companies for the same year
        const reports = await getReports();
        
        if (!Array.isArray(reports) || reports.length === 0) {
          throw new Error("No reports available for comparison");
        }

        const report1 = reports.find(r => 
          (r.ticker && r.ticker.includes(params.company1 as string)) || 
          r.company.includes(params.company1 as string));
          
        const report2 = reports.find(r => 
          (r.ticker && r.ticker.includes(params.company2 as string)) || 
          r.company.includes(params.company2 as string));

        if (!report1 || !report2) {
          throw new Error("One or both companies not found");
        }

        return {
          type: "companies",
          report1,
          report2
        };
      } 
      else if (params.company && params.year1 && params.year2) {
        // Compare same company across different years
        const reports = await getReports();
        
        if (!Array.isArray(reports) || reports.length === 0) {
          throw new Error("No reports available for comparison");
        }

        const report1 = reports.find(r => 
          ((r.ticker && r.ticker.includes(params.company as string)) || 
           r.company.includes(params.company as string)) && 
          r.year.toString() === params.year1);
          
        const report2 = reports.find(r => 
          ((r.ticker && r.ticker.includes(params.company as string)) || 
           r.company.includes(params.company as string)) && 
          r.year.toString() === params.year2);

        if (!report1 || !report2) {
          throw new Error("Reports for the specified years not found");
        }

        return {
          type: "years",
          report1,
          report2
        };
      }
      
      throw new Error("Failed to compare reports");
    }

    const data = await response.json();
    return data as ComparisonResult;
  } catch (error) {
    console.error("Error comparing reports:", error);
    throw error;
  }
}

// API functions
export const api = {
  // Get all reports with optional filters
  async getReports(params?: { industry?: string; year?: number; minScore?: number }) {
    try {
      const response = await apiClient.get('/reports', { params });
      const data = response.data;
      // Ensure we always return an array, even if the backend returns null or undefined
      if (!data) return [];
      return data as ESGReport[];
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  // Get a single report by ID
  async getReport(id: string) {
    try {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data as ESGReport; 
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      throw error;
    }
  },

  // Create a new report
  async createReport(report: Omit<ESGReport, 'id'>) {
    try {
      const response = await apiClient.post('/reports', report);
      return response.data as ESGReport;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Delete a report by ID
  async deleteReport(id: string) {
    try {
      const response = await apiClient.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting report ${id}:`, error);
      throw error;
    }
  },

  // Compare reports
  async compareReports(params: ComparisonParams): Promise<ComparisonResult> {
    return compareReports(params);
  },

  // Check API health
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('API health check failed:', error);
      throw error;
    }
  }
};

