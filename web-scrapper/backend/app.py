from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore
from transformers import pipeline  # type: ignore
import requests
import torch # type: ignore

app = Flask(__name__)
CORS(app)

device = 0 if torch.cuda.is_available() else -1
# Load the summarization model
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=device)


def extract_themes(content):
   # Truncate content to the first 1000 characters (or use another strategy)
   if len(content) > 1000:
       content = content[:1000]  # Truncate to first 1000 characters


   # Use the Hugging Face summarization pipeline to extract themes
   summary = summarizer(content, max_length=50, min_length=25, do_sample=False)
   themes = summary[0]['summary_text'].strip()
  
   # Split the summary into themes
   return [theme.strip() for theme in themes.split(',')]




def generate_questions(themes):
   questions = []
   for theme in themes[:5]:  # Limit to 5 questions
       questions.append(f"Are you interested in {theme.strip()}?")
   return questions


# Endpoint for scraping
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


       # Ensure the content is not empty
       if not content:
           return jsonify({'error': 'No content found at the provided URL'}), 400


       themes = extract_themes(content)
       return jsonify({'themes': themes}), 200  # Return extracted themes for further processing
   except requests.exceptions.RequestException as e:
       return jsonify({'error': f'Request error: {str(e)}'}), 500
   except Exception as e:
       return jsonify({'error': f'An error occurred: {str(e)}'}), 500


# Endpoint to generate questions based on content
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


# Endpoint to classify users based on responses and topics
@app.route('/classify_user', methods=['POST'])
def classify_user():
   data = request.get_json()
  
   # Check if 'responses' are provided in the request data
   responses = data.get('responses') if data else None
   if not responses:
       return jsonify({'error': 'Responses are required for classification'}), 400


   try:
       # Prepare the prompt for classification
       prompt = f"Based on the following responses from a user, classify their interests: {responses}. Please provide a detailed classification."
      
       # Here we could also use a different model for classification if desired
       classifier = pipeline("zero-shot-classification")  # Example classification model
       classification = classifier(prompt, candidate_labels=["technology", "health", "sports", "entertainment", "finance"])
      
       return jsonify({'classification': classification}), 200
   except Exception as e:
       return jsonify({'error': f'An error occurred while classifying user: {str(e)}'}), 500


if __name__ == '__main__':
   app.run(debug=True)


