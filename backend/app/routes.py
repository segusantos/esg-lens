from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import List, Optional, Dict, Any
import os
import shutil
from pathlib import Path
import sys
from datetime import datetime

# Add the parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from process_reports.process_new_report import processNewReport

from app.database import (
    get_reports, 
    get_report, 
    create_report, 
    delete_report, 
    update_report, 
    save_processed_report
)

router = APIRouter()


@router.get("/reports")
async def read_reports(
    industry: Optional[str] = Query(None, description="Filter by industry"),
    year: Optional[int] = Query(None, description="Filter by year"),
    min_score: Optional[int] = Query(None, ge=0, le=100, description="Minimum ESG score"),
):
    """Get all ESG reports with optional filtering."""
    reports = get_reports()
    
    # Apply filters if provided
    if industry:
        reports = [r for r in reports if r.industry.lower() == industry.lower()]
    if year:
        reports = [r for r in reports if r.year == year]
    if min_score is not None:
        reports = [r for r in reports if r.esg_score >= min_score]
    
    return reports


@router.get("/reports/{report_id}")
async def read_report(report_id: str):
    """Get a specific ESG report by ID."""
    report = get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report


@router.post("/reports")
async def create_new_report(report):
    """Create a new ESG report."""
    return create_report(report)


@router.put("/reports/{report_id}")
async def update_existing_report(report_id: str, report_data: Dict[str, Any]):
    """Update a specific ESG report by ID."""
    updated_report = update_report(report_id, report_data)
    if updated_report is None:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return updated_report


@router.delete("/reports/{report_id}", response_model=bool)
async def delete_existing_report(report_id: str):
    """Delete a specific ESG report by ID."""
    result = delete_report(report_id)
    if not result:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return result


@router.post("/upload/pdf")
async def upload_and_process_pdf(
    file: UploadFile = File(...),
    company: str = Form(...),
    year: int = Form(...),
    industry: str = Form(...),
    ticker: str = Form(...),
):
    """
    Upload and process a PDF file to extract ESG data
    
    """
    # Validate the file is a PDF
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")
    
    reports_dir = Path("process_reports/data/reports")

    # Use the original filename
    safe_filename = file.filename
    file_path = reports_dir / safe_filename
    
    # Save the file
    with open(file_path, "wb") as dest_file:
        # Reset file pointer to the beginning
        file.file.seek(0)
        # Copy uploaded content to the destination file
        shutil.copyfileobj(file.file, dest_file)

    # Process the PDF
    try:
        processed_report = processNewReport(file_path, 'process_reports')
        processed_report['company'] = company
        processed_report['year'] = year
        processed_report['industry'] = industry
        processed_report['publish_date'] = datetime.now().strftime("%Y-%m-%d")
        processed_report['ticker'] = ticker
        processed_report['file_name'] = Path(safe_filename).stem
        
        # Save the processed report data
        report = save_processed_report(processed_report)
        
        return report
        
    except Exception as e:
        # If there's an error, still keep the file but log the error
        print(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.get("/health")
async def health_check():
    """API health check endpoint."""
    return {"status": "ok"} 