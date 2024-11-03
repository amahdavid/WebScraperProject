from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore
import requests
import openai
import os

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_themes(content):
    if len(content) > 1000:
        content = content[:1000]
    return content.split()

def generate_questions(themes):
    questions = [f"Are you interested in {theme.strip()}?" for theme in themes[:5]]
    return questions

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url') if data else None
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    try:
        response = requests.get(url)
        response.raise_for_status()
        content = response.text

        if not content:
            return jsonify({'error': 'No content found at the provided URL'}), 400

        themes = extract_themes(content)
        return jsonify({'themes': themes}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request error: {str(e)}'}), 500

@app.route('/questions', methods=['POST'])
def questions():
    data = request.get_json()
    themes = data.get('themes') if data else None
    if not themes:
        return jsonify({'error': 'Themes are required to generate questions'}), 400
    try:
        questions = generate_questions(themes)
        return jsonify({'questions': questions}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while generating questions: {str(e)}'}), 500

@app.route('/classify_user', methods=['POST'])
def classify_user():
    data = request.get_json()
    responses = data.get('responses') if data else None

    if not responses:
        return jsonify({'error': 'Responses are required for classification'}), 400
    try:
        # Use OpenAI to classify user interests based on responses
        prompt = f"Based on the following responses: {responses}, classify the user's interests and provide a detailed message."
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        classification_message = completion['choices'][0]['message']['content']
        return jsonify({'classification': classification_message}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while classifying user: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
