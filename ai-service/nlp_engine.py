from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def generate_explanation(log, risk):
    try:
        completion = client.chat.completions.create(
            model="google/gemma-3n-e2b-it:free",
            messages=[
                {"role": "system", "content": "You are an industrial maintenance expert."},
                {"role": "user", "content": f"Explain this issue: {log} with risk level {risk}"}
            ],
        )
        return completion.choices[0].message.content

    except Exception as e:
        # fallback (VERY IMPORTANT for hackathon)
        return f"AI fallback: {risk} risk detected due to {log}"