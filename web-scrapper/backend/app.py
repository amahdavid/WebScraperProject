from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app)

# endpoint for scraping
@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    
    # Check if 'url' is provided in the request data
    url = data.get('url') if data else None
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.get_text()
        return jsonify({'content': content}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
# endpoint to generate questions
@app.route('/questions', methods=['POST'])
def questions():
    data = request.get_json()
    
    # Check if 'content' is provided in the request data
    content = data.get('content') if data else None
    if not content:
        return jsonify({'error': 'Content is required to generate questions'}), 400
    
    try:
        # Placeholder questions
        questions = ["Are you interested in Games?", "Do you work in the Tech Industry?"]
        return jsonify({'questions': questions}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while generating questions: {str(e)}'}), 500


# endpoint to classify users
@app.route('/classify_user', methods=['POST'])
def classify_user():
    data = request.get_json()
    
    # Check if 'responses' are provided in the request data
    responses = data.get('responses') if data else None
    if not responses:
        return jsonify({'error': 'Responses are required for classification'}), 400
    
    try:
        # Placeholder classification, replace with real logic if needed
        classification = "Interested in the Gaming industry"
        return jsonify({'classification': classification}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while classifying user: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)