from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore
from transformers import pipeline  # type: ignore
import requests
import torch # type: ignore

app = Flask(__name__)
CORS(app)

device = 0 if torch.cuda.is_available() else -1
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=device)
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=device)


def extract_themes(content):
   if len(content) > 1000:
       content = content[:1000]

   summary = summarizer(content, max_length=50, min_length=25, do_sample=False)
   themes = summary[0]['summary_text'].strip()
   return [theme.strip() for theme in themes.split(',')]


def generate_questions(themes):
   questions = []
   for theme in themes[:5]:
       questions.append(f"Are you interested in {theme.strip()}?")
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
   except Exception as e:
       return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/questions', methods=['POST'])
def questions():
   data = request.get_json()
   themes = data.get('content') if data else None
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
        prompt = f"Based on the following responses from a user, classify their interests: {responses}. Please provide a detailed classification."
        classification = classifier(prompt, candidate_labels=["technology", "health", "sports", "entertainment", "finance"])
        result = {
            'labels': classification['labels'],
            'scores': classification['scores'],
            'sequence': classification['sequence']
        }
        return jsonify({'classification': result}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while classifying user: {str(e)}'}), 500


if __name__ == '__main__':
   app.run(debug=True)
