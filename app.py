from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# In-memory quiz data
quiz_data = [
    {
        "question": "What is the tallest mountain in the world?",
        "options": ["Himalaya", "Mt. Everest", "Galdhøpiggen", "K2"],
        "correctAnswer": "Mt. Everest"
    },
    {
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "correctAnswer": "Mars"
    }
]

# Serve the frontend HTML (index.html)
@app.route('/')
def index():
    return render_template('index.html')

# API to get quiz questions
@app.route('/quiz', methods=['GET'])
def get_quiz():
    return jsonify([{
        'question': q['question'],
        'options': q['options']
    } for q in quiz_data])

# API to submit answers and calculate score
@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    answers = request.json.get('answers')
    score = sum(1 for i, answer in enumerate(answers) if answer == quiz_data[i]['correctAnswer'])
    return jsonify({'score': score, 'total': len(quiz_data)})

if __name__ == '__main__':
    app.run(debug=True)
