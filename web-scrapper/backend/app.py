from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

# endpoint for scraping, put in a try catch later
@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.get_text()
        return jsonify({'content': content}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# endpoint to generate questions, put in a try catch later
@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    content = request.get_json().get('content')
    # Figure out what to generate questions but will be using placeholders for now
    questions = ["Are you interested in Games?", "Do you work in the Tech Industry?"]
    return jsonify({'questions': questions}), 200

# endpoint to classy users
@app.route('/classify_user', methods=['POST'])
def classify_user():
    responses = request.get_json().get('responses')
    # placeholders for classification
    classification = "Interested in the Gaming industry"
    return jsonify({'classification': classification}), 200

if __name__ == '__main__':
    app.run(debug=True)