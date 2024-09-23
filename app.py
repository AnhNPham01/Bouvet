from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

quiz_data = [
    {"question": "Hva er verdens høyeste fjell?", "options": ["Himalaya", "Mt. Everest", "Galdhøpiggen", "K2"], "correctAnswer": "Mt. Everest"},
    {"question": "Hva er hovedstaden i Norge?", "options": ["Bergen", "Oslo", "Stavanger", "Trondheim"], "correctAnswer": "Oslo"},
    {"question": "Hvilket år startet 2. verdenskrig?", "options": ["1914", "1939", "1945", "1961"], "correctAnswer": "1939"},
    {"question": "Hva er det største havet?", "options": ["Atlanterhavet", "Stillehavet", "Indiske hav", "Arktiske hav"], "correctAnswer": "Stillehavet"},
    {"question": "Hvem malte Mona Lisa?", "options": ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"], "correctAnswer": "Leonardo da Vinci"},
    {"question": "Hva er den mest folkerike byen i verden?", "options": ["Tokyo", "Shanghai", "New York", "Mumbai"], "correctAnswer": "Tokyo"},
    {"question": "Hvilken planet er kjent som den røde planet?", "options": ["Jupiter", "Mars", "Venus", "Saturn"], "correctAnswer": "Mars"},
    {"question": "Hvem skrev 'Romeo og Julie'?", "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Ernest Hemingway"], "correctAnswer": "William Shakespeare"},
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
