# 1. app.py (Backend) - Optimerad prestanda
from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv
from flask_cors import CORS
import time

load_dotenv()

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_with_openai(prompt):
    try:
        start_time = time.time()  # Starta tidtagning
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Du är en pedagogisk AI som genererar utbildningsmaterial."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,  # Minska tokens för snabbare svar
            temperature=0.5  # Lägre temperatur för mer direkta svar
        )
        duration = time.time() - start_time
        print(f"OpenAI Response Time: {duration:.2f} sekunder")
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        print("Mottagen data:", data)  # Debugging

        content_type = data.get('type')
        subject = data.get('subject')
        grade = data.get('grade')
        details = data.get('details')
        num_items = int(data.get('num_items'))

        prompt = ""
        if content_type == "quiz":
            prompt = f"Skapa {num_items} snabba quizfrågor för {subject} årskurs {grade}. Fokus: {details}. Kortfattade frågor och svar."
        elif content_type == "flashcards":
            prompt = f"Skapa {num_items} pedagogiska flashcards för {subject} årskurs {grade}. Fokus: {details}."
        else:
            return jsonify({"error": "Ogiltig typ"}), 400

        generated_text = generate_with_openai(prompt)
        if not generated_text:
            raise Exception("OpenAI API svarade inte.")

        result = []
        lines = [line.strip() for line in generated_text.split('\n') if line.strip()]

        if content_type == "quiz":
            for i in range(0, len(lines), 2):
                if i+1 < len(lines):
                    question = lines[i].replace("Fråga:", "").strip()
                    answer = lines[i+1].replace("Svar:", "").strip()
                    result.append({"question": question, "answer": answer})
        elif content_type == "flashcards":
            for i in range(0, len(lines), 2):
                if i+1 < len(lines):
                    term = lines[i].replace("Begrepp:", "").strip()
                    definition = lines[i+1].replace("Definition:", "").strip()
                    result.append({"term": term, "definition": definition})

        return jsonify({"data": result[:num_items]})
    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

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
