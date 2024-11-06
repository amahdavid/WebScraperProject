from flask import Flask, request, jsonify
from flask_cors import CORS  # type: ignore
import openai, os, re, requests

app = Flask(__name__)
CORS(app)
openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_themes(content):
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1) if title_match else "No title found"

    headings = re.findall(r'<h[1-3]>(.*?)</h[1-3]>', content)
    headings = [h.strip() for h in headings]

    meta_match = re.search(r'<meta name="description" content="(.*?)"', content)
    description = meta_match.group(1) if meta_match else "No description found"

    paragraphs = re.findall(r'<p>(.*?)</p>', content)
    paragraphs = [p.strip() for p in paragraphs]

    themes = [title] + headings + [description] + paragraphs
    return [theme for theme in themes if theme]


def generate_questions(themes):
    questions = [f"Are you interested in {theme.strip()}?" for theme in themes[:3]]
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
    responses = data.get('responses')
    questions = data.get('questions')

    if responses is None or questions is None:
        return jsonify({'error': 'Responses and Questions are required for classification'}), 400

    try:
        combined_responses = "\n".join(f"{q}: {r}" for q, r in zip(questions, responses))
        prompt = f"Based on the following answers to the questions:\n{combined_responses}, classify the user's interests and provide a detailed message."

        # Update to the new API syntax
        completion = openai.completions.create(
            model="gpt-3.5-turbo",
            prompt=prompt,
            max_tokens=150
        )

        # Extract the classification message
        classification_message = completion['choices'][0]['text'].strip()
        return jsonify({'classification': classification_message}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred while classifying user: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
