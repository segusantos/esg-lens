from datetime import date
from typing import Dict, List, Optional

from pydantic import BaseModel


class ESGReport(BaseModel):
    id: str
    company: str
    ticker: str
    year: int
    industry: str
    esg_score: int
    environment_score: int
    social_score: int
    governance_score: int
    report_quality: str
    publish_date: str
    file_url: str
    website_url: Optional[str] = None
    summary: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    key_metrics: Optional[Dict[str, str]] = None


class ESGReportCreate(BaseModel):
    company: str
    ticker: str
    year: int
    industry: str
    esg_score: int
    environment_score: int
    social_score: int
    governance_score: int
    report_quality: str
    publish_date: str
    file_url: str
    website_url: Optional[str] = None
    summary: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    key_metrics: Optional[Dict[str, str]] = None 