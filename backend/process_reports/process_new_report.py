import os
import sys
import json
import pandas as pd

# Fix imports for generateDataset modules
from .generateDataset.textract import extractTextFromPdf
from .generateDataset.summary import getSummary
from .generateDataset.guidelines import getGuidelineFeedback
from .generateDataset.conclusions import getConclusion
from .generateDataset.getClient import getClient


def processNewReport(pdf_file_path, rootpath):
    """
    Process a new ESG report PDF file by extracting text and generating a summary.

    Args:
        pdf_file_path (str): The local file path of the PDF to be processed.
        rootpath (str): The root path of the project.

    Returns:
        str: The extracted text from the PDF.
    """
    print(f"[*] Processing {pdf_file_path}...")
    data = dict()
    name = os.path.basename(pdf_file_path).split(".")[0]  # Extract name from file path

    outputFile = os.path.join(rootpath, "data", "texts", name + ".txt")
    if not os.path.exists(outputFile):
        text = extractTextFromPdf(pdf_file_path)
        with open(os.path.join(outputFile), "w", encoding="utf-8") as file:
            file.write(text)


    outputFile = os.path.join(rootpath, "data", "summaries", name + ".json")
    if not os.path.exists(outputFile):
        client = getClient('')
        summary = getSummary(pdf_file_path,client, rootpath)
        with open(outputFile, "w", encoding="utf-8") as file:
            json.dump(summary, file, ensure_ascii=False, indent=4)
    else:
        with open(outputFile, "r", encoding="utf-8") as file:
            summary = json.load(file)             
    data["SUMMARY"] = summary

        
    outputFile = os.path.join(rootpath,"data","scores", "ESGScores.json")
    with open(outputFile, "r",  encoding="utf-8") as file:
        scores = file.read().replace('\n', '')
    
    # Check if name exists in the scores JSON before accessing it
    scores_data = json.loads(scores)
    if name in scores_data:
        data["SCORES"] = scores_data[name]
    else:
        print(f"Warning: No score data found for {name}")
        data["SCORES"] = {}
    
    # Check if lawScores file exists before reading it
    law_scores_path = os.path.join(rootpath, "data", "scores", "lawScores", name + "_cos_score.csv")
    if os.path.exists(law_scores_path):
        lawScores = pd.read_csv(law_scores_path)
        data["LAWSCORES"] = lawScores.to_dict(orient="records")
    else:
        print(f"Warning: No law scores found for {name}")
        data["LAWSCORES"] = []


    outputFile = os.path.join(rootpath, "data", "feedbackGuideline", name + ".txt")
    if not os.path.exists(outputFile):
        client = getClient('')
        feedback = getGuidelineFeedback(pdf_file_path,client,rootpath)
        with open(outputFile, "w", encoding="utf-8") as file:
            file.write(feedback)
    else:
        with open(outputFile, "r", encoding="utf-8") as file:
            feedback = file.read().replace('\n', '')
    data["FEEDBACK"] = feedback

    outputFile = os.path.join(rootpath, "data", "conclusions", name + ".txt")
    if not os.path.exists(outputFile):
        client = getClient('')
        conclusion = getConclusion(pdf_file_path, client, rootpath)
        with open(outputFile, "w", encoding="utf-8") as file:
            file.write(conclusion)
    else:
        with open(outputFile, "r", encoding="utf-8") as file:
            conclusion = file.read().replace('\n', '')
    data["CONCLUSION"] = conclusion

    return data     

if __name__ == "__main__":
    # Path to your PDF file
    name = "Pampa-2022-Reporte-Sustentabilidad"
    file_path = os.path.join("process_reports", "data", "reports", name + ".pdf")  # Replace with your PDF file path

    # Process the PDF file
    processNewReport(file_path, "process_reports")  # Pass the root path if needed