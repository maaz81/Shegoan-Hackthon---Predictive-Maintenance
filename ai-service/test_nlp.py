import os
import sys
from nlp_engine import generate_explanation, generate_maintenance_plan

def test_nlp():
    print("Testing generate_explanation...")
    try:
        from openai import OpenAI
        from dotenv import load_dotenv
        load_dotenv()
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        completion = client.chat.completions.create(
            model="google/gemma-3n-e2b-it:free",
            messages=[
                {"role": "system", "content": "You are a senior industrial maintenance engineer."},
                {"role": "user",   "content": "Test"}
            ],
            max_tokens=200,
        )
        print("Success for gemma-3n:", completion.choices[0].message.content)
    except Exception as e:
        print("Error for gemma-3n:")
        import traceback
        traceback.print_exc()

    print("\nTesting generate_maintenance_plan...")
    try:
        from openai import OpenAI
        from dotenv import load_dotenv
        load_dotenv()
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        completion = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct:free",
            messages=[
                {"role": "system", "content": "You are a maintenance planning engineer."},
                {"role": "user",   "content": "Test"}
            ],
            max_tokens=250,
        )
        print("Success for mistral:", completion.choices[0].message.content)
    except Exception as e:
        print("Error for mistral:")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_nlp()
