from flask import Flask, request, jsonify, render_template
import openai
import os
from dotenv import load_dotenv

# Ladda miljövariabler från .env-filen
load_dotenv()

app = Flask(__name__)

# Hämta OpenAI API-nyckeln från .env-filen
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/flashcards')
def flashcards():
    return render_template('flashcards.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/generate_flashcards', methods=['POST'])
def generate_flashcards():
    data = request.json
    subject = data.get('subject')
    details = data.get('details')

    # Använd OpenAI API för att generera flashcards
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Skapa flashcards för ämnet {subject} med följande detaljer: {details}",
        max_tokens=150
    )

    return jsonify(response.choices[0].text.strip())

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    subject = data.get('subject')
    details = data.get('details')
    num_questions = data.get('num_questions')

    # Använd OpenAI API för att generera quiz
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Skapa ett quiz med {num_questions} frågor för ämnet {subject} med följande detaljer: {details}",
        max_tokens=150
    )

    return jsonify(response.choices[0].text.strip())

@app.route('/generate_test', methods=['POST'])
def generate_test():
    data = request.json
    subject = data.get('subject')
    details = data.get('details')

    # Använd OpenAI API för att generera ett prov
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Skapa ett prov för ämnet {subject} med följande detaljer: {details}",
        max_tokens=150
    )

    return jsonify(response.choices[0].text.strip())

if __name__ == '__main__':
    app.run(debug=True)
