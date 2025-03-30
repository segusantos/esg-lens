// API client for connecting to the Python backend

import axios from 'axios';

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

// Function to rename snake_case to camelCase properties
function toCamelCase(report: any): any {
  // If it's not an object or null, return it as is
  if (typeof report !== 'object' || report === null) {
    return report;
  }

  // If it's an array, map over its elements
  if (Array.isArray(report)) {
    return report.map(item => toCamelCase(item));
  }

  // It's an object, convert keys to camelCase
  const camelCaseObj: any = {};
  for (const key in report) {
    if (Object.prototype.hasOwnProperty.call(report, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseObj[camelKey] = toCamelCase(report[key]);
    }
  }
  return camelCaseObj;
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
  year1?: number;
  year2?: number;
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
  if (params.year1) queryParams.append("year1", params.year1.toString());
  if (params.year2) queryParams.append("year2", params.year2.toString());

  const response = await fetch(`${API_URL}/compare?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to compare reports");
  }

  return response.json();
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
      return toCamelCase(data) as ESGReport[];
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
      return toCamelCase(response.data) as ESGReport;
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      throw error;
    }
  },

  // Create a new report
  async createReport(report: Omit<ESGReport, 'id'>) {
    try {
      const response = await apiClient.post('/reports', report);
      return toCamelCase(response.data) as ESGReport;
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

