# app.py (Backend)
from flask import Flask, render_template, request, jsonify
import openai
import os
import asyncio
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")

async def generate_with_openai(prompt):
    try:
        response = await openai.ChatCompletion.acreate(  # Asynkront anrop
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Du är en pedagogisk AI som genererar utbildningsmaterial."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,  # Mindre antal tokens för snabbare svar
            temperature=0.5  # Mindre variation för effektivare svar
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return None

@app.route('/generate', methods=['POST'])
async def generate():
    try:
        data = request.json
        print("Mottagen data:", data)  # Debugging

        content_type = data.get('type')
        subject = data.get('subject')
        grade = data.get('grade', "okänd")
        details = data.get('details')
        num_items = int(data.get('num_items', 5))

        if not all([content_type, subject, details]):
            return jsonify({"error": "Vänligen fyll i alla fält."}), 400

        # **Parallellisera genereringen**
        prompts = []
        for _ in range(num_items):
            if content_type == "quiz":
                prompts.append(f"Skapa en quizfråga för {subject} årskurs {grade}. Fokus: {details}.")
            elif content_type == "flashcards":
                prompts.append(f"Skapa ett flashcard för {subject} årskurs {grade}. Fokus: {details}.")

        # Kör alla OpenAI-anrop parallellt för snabbhet
        responses = await asyncio.gather(*[generate_with_openai(p) for p in prompts])

        result = []
        for res in responses:
            if content_type == "quiz":
                lines = res.split("\n")
                if len(lines) >= 2:
                    question = lines[0].replace("Fråga:", "").strip()
                    answer = lines[1].replace("Svar:", "").strip()
                    result.append({"question": question, "answer": answer})
            elif content_type == "flashcards":
                lines = res.split("\n")
                if len(lines) >= 2:
                    term = lines[0].replace("Begrepp:", "").strip()
                    definition = lines[1].replace("Definition:", "").strip()
                    result.append({"term": term, "definition": definition})

        return jsonify({"data": result})
    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/flashcards')
def flashcards():
    return render_template('flashcards.html')

@app.route('/loading')
def loading():
    return render_template('loading.html')

if __name__ == '__main__':
    app.run(debug=True)