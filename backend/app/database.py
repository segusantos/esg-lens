from typing import Dict, List, Optional, Tuple
import uuid
import json
import os
from datetime import datetime
from pathlib import Path

from app.models import ESGReport, ESGReportCreate

# Path to store report JSON files
DATA_DIR = Path(__file__).parent.parent / "data" / "reports"

# Create the data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# In-memory database for reports
reports_db: Dict[str, ESGReport] = {}

# Sample data from frontend


def init_db():
    """Initialize the database with sample data and load existing report files."""
    
    load_reports_from_files()


def load_reports_from_files():
    """Load reports from JSON files in the data directory."""
    for file_path in DATA_DIR.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                report_data = json.load(f)
                report_id = report_data.get("id")
                
                # Only load if not already in memory
                if report_id and report_id not in reports_db:
                    report = ESGReport(**report_data)
                    reports_db[report_id] = report
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error loading report from {file_path}: {e}")


def save_report_to_file(report: ESGReport):
    """Save a report to a JSON file."""
    file_path = DATA_DIR / f"{report.id}.json"
    
    with open(file_path, "w", encoding="utf-8") as f:
        # Convert the model to a dictionary and save as JSON
        json.dump(report.dict(), f, ensure_ascii=False, indent=2)


def get_reports():
    """Get all reports."""
    return list(reports_db.values())


def get_report(report_id: str):
    """Get a report by ID."""
    return reports_db.get(report_id)


def create_report(report: ESGReportCreate):
    """Create a new report."""
    # Generate a unique ID
    report_id = str(uuid.uuid4())
    
    # Create a new report with the generated ID
    db_report = ESGReport(id=report_id, **report.dict())
    
    # Store in memory
    reports_db[report_id] = db_report
    
    # Save to file
    save_report_to_file(db_report)
    
    return db_report


def update_report(report_id: str, report_data: Dict):
    """Update an existing report."""
    if report_id not in reports_db:
        return None
    
    # Get the existing report
    existing_report = reports_db[report_id]
    
    # Update fields
    updated_report_dict = existing_report.dict()
    updated_report_dict.update(report_data)
    
    # Create updated report
    updated_report = ESGReport(**updated_report_dict)
    
    # Save to memory and file
    reports_db[report_id] = updated_report
    save_report_to_file(updated_report)
    
    return updated_report


def delete_report(report_id: str):
    """Delete a report from memory and file system."""
    if report_id in reports_db:
        # Remove from memory
        del reports_db[report_id]
        
        # Remove the file if it exists
        file_path = DATA_DIR / f"{report_id}.json"
        if file_path.exists():
            file_path.unlink()
        
        return True
    return False


def save_processed_report(report_data: Dict):
    """Save a processed report from a PDF analysis."""
    # Generate a report ID if not provided
    report_id = report_data.get("id", str(uuid.uuid4()))
    report_data["id"] = report_id
    
    # Set creation timestamp if not present
    if "publish_date" not in report_data:
        report_data["publish_date"] = datetime.now().strftime("%Y-%m-%d")
    
    # Create the report
    report = ESGReport(**report_data)
    
    # Save to memory and file
    reports_db[report_id] = report
    save_report_to_file(report)
    
    return report


# Initialize the database with sample data
init_db() 