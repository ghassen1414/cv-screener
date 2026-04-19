# test_gemini.py
import os
from dotenv import load_dotenv
from gemini import analyze_with_gemini

load_dotenv()

# Minimal fake CV
cv_text = """
John Doe
Software Engineer

Skills: Python, FastAPI, Docker, PostgreSQL
Experience:
- 3 years backend development at TechCorp
- Built REST APIs serving 10k daily users
- Deployed applications using Docker and CI/CD pipelines

Education: BSc Computer Science, 2021
"""

# Minimal fake job description
job_desc = """
We are looking for a Backend Engineer with:
- Strong Python experience
- Experience with FastAPI or Django
- Knowledge of cloud platforms (AWS, GCP, or Azure)
- Familiarity with Kubernetes
- PostgreSQL or MongoDB experience
"""

print("Sending request...")

result = analyze_with_gemini(cv_text, job_desc)

print("Result:")
print(f"  Match Score:      {result['match_score']}/100")
print(f"  Matched Skills:   {result['matched_skills']}")
print(f"  Missing Skills:   {result['missing_skills']}")
print(f"  Recommendations:  {result['recommendations']}")
print(f"  Summary:          {result['summary']}")