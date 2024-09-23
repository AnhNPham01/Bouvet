from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dummy quiz data
quiz_data = [
    {"question": "Hva er verdens høyeste fjell?", "options": ["Himalaya", "Mt. Everest", "Galdhøpiggen", "K2"], "correctAnswer": "Mt. Everest"},
    {"question": "Hva er hovedstaden i Norge?", "options": ["Bergen", "Oslo", "Stavanger", "Trondheim"], "correctAnswer": "Oslo"},
    {"question": "Hvilket år startet 2. verdenskrig?", "options": ["1914", "1939", "1945", "1961"], "correctAnswer": "1939"},
]

# New route for the root URL
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Quiz App Backend!"

@app.route('/quiz', methods=['GET'])
def get_quiz():
    return jsonify([{"question": q['question'], "options": q['options']} for q in quiz_data])

@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    answers = request.json.get('answers')
    score = sum(1 for i, answer in enumerate(answers) if answer == quiz_data[i]['correctAnswer'])
    return jsonify({'score': score, 'total': len(quiz_data)})

if __name__ == '__main__':
    app.run(debug=True)
