import boto3
import time
import os
import boto3
import time
import os
from dotenv import load_dotenv

load_dotenv()

# Define your IAM user credentials here
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

def upload_to_s3(pdf_file_path, bucket_name, s3_key):
    """
    Uploads a PDF file to an AWS S3 bucket.

    Args:
        pdf_file_path (str): The local file path of the PDF to be uploaded.
        bucket_name (str): The name of the S3 bucket where the file will be uploaded.
        s3_key (str): The key (path) within the S3 bucket where the file will be stored.
    """
    # Initialize AWS S3 with explicit credentials
    s3 = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )
    with open(pdf_file_path, 'rb') as data:
        s3.upload_fileobj(data, bucket_name, s3_key)

def extractTextFromPdf(pdf_file_path):
    """
    Extracts text from a PDF file using AWS Textract.
    """
    bucket_name = 'hackitba2025chirimbucket'
    s3_key = os.path.basename(pdf_file_path)

    # Initialize AWS Textract client with explicit credentials
    textract = boto3.client(
        'textract',
        region_name='us-east-2',  # Specify your region
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
    )

    upload_to_s3(pdf_file_path, bucket_name, s3_key)

    # Start text extraction job
    response = textract.start_document_text_detection(
        DocumentLocation={'S3Object': {'Bucket': bucket_name, 'Name': s3_key}}
    )

    job_id = response['JobId']
    print(f"[*] Started job with ID: {job_id}...")

    # Poll for job completion
    while True:
        result = textract.get_document_text_detection(JobId=job_id)
        status = result['JobStatus']

        if status == 'SUCCEEDED':
            print("[+] Text extraction succeeded.")
            break
        elif status == 'FAILED':
            print("[x] Text extraction failed.")
            raise Exception("Text extraction failed: " + result['StatusMessage'])
        else:
            print("[*] In progress, waiting...")
            time.sleep(40)

    # Handle pagination for all blocks of text
    extracted_text = ''
    next_token = None

    while True:
        if next_token:
            result = textract.get_document_text_detection(JobId=job_id, NextToken=next_token)

        for block in result['Blocks']:
            if block['BlockType'] == 'LINE':
                extracted_text += block['Text'] + '\n'

        next_token = result.get('NextToken')
        if not next_token:
            break

    return extracted_text



if __name__ == "__main__":
    name = "testPdf"
    pdf_file_path = os.path.join( 'process_reports', "data",'reports', "testPdf.pdf")

    extracted_text = extractTextFromPdf(pdf_file_path)

    print(extracted_text)

    with open("resumen_guia_divulgacion_asg.txt", "w", encoding="utf-8") as f:
        f.write(extracted_text)
