import json
from openai import OpenAI # pip install openai
import os
from .upload_to_vector_store import uploadToVectorStore
import pandas as pd
from .getClient import getClient

def getConclusion(textPath, client,rootpath=""):

    # read prompt from file
    prompt_path = os.path.join(rootpath,"generateDataset", "prompts", "conclusion.txt")
    with open(prompt_path, "r", encoding="utf-8") as file:
        prompt = file.read().replace('\n', '')

    # read ESG report from file
    name = os.path.basename(textPath).split(".")[0]  # Extract name from file path
    report_path = os.path.join(rootpath,"data", "texts", name + ".txt")

    # Upload the ESG report to the vector store
    response, vector_store = uploadToVectorStore(report_path, client)
    if response.last_error:
        print("[x] Something went wrong: ", response.last_error)
    else:
        print("[+] ESG report uploaded successfully")
    
    # read company guideline feedback from file
    company_guideline_path = os.path.join(rootpath,"data","feedbackGuideline", name + ".txt")
    with open(company_guideline_path, "r",  encoding="utf-8") as file:
        companyFeedbackGuideline = file.read().replace('\n', '')

    # read company scores from file
    company_scores_path = os.path.join(rootpath,"data","scores", "ESGScores.json")
    with open(company_scores_path, "r",  encoding="utf-8") as file:
        scores = file.read().replace('\n', '')
    
    # Check if name exists in the scores JSON before accessing it
    scores_data = json.loads(scores)
    if name in scores_data:
        companyScores = scores_data[name]
    else:
        print(f"Warning: No score data found for {name}")
        companyScores = {}

    # read company summary from file
    company_summary_path = os.path.join(rootpath,"data","summaries", name + ".json")
    with open(company_summary_path, "r",  encoding="utf-8") as file:
        summary = file.read().replace('\n', '')
    companySummary = json.loads(summary)

    # read company law scores
    law_scores_path = os.path.join(rootpath, "data", "scores", "lawScores", name + "_cos_score.csv")
    if os.path.exists(law_scores_path):
        company_law_scores = pd.read_csv(law_scores_path)
    else:
        print(f"Warning: No law scores found for {name}")
        company_law_scores = pd.DataFrame()

    print("[*] Generating feedback on guideline...")
    response = client.responses.create(
        model="gpt-4o-mini",
        input=[{
            "role": "user", 
            "content": prompt + "\n" + companyFeedbackGuideline + "\n" + str(companyScores) + "\n" + str(companySummary) + "\n" + company_law_scores.to_string() + "\n"
        }]
        
    )


    return response.output_text


if __name__ == "__main__":
    # Path to your PDF file
    name = "Pampa-2022-Reporte-Sustentabilidad"
    file_path = os.path.join("data", name + ".txt")  # Replace with your PDF file path

    # Get the summary of the txt file
    events = getConclusion(file_path,  getClient(os.path.join("openai_key.txt")),'process_reports')

    # Save the structured output to a file
    output_path = os.path.join("process_reports", "data", "conclusions", name + ".txt")
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(events, file, ensure_ascii=False, indent=4)

    print(f"Structured output saved to {output_path}")