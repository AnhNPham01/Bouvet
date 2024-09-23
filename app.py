from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Initialize the database
def init_db():
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()

    # Create table for quiz results
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            answers TEXT,
            score INTEGER
        )
    ''')

    # Create table for user registration
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    ''')

    conn.commit()
    conn.close()

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
    user_id = request.json.get('user_id')  # Get user_id from the request
    answers = request.json.get('answers')
    score = sum(1 for i, answer in enumerate(answers) if answer == quiz_data[i]['correctAnswer'])

    # Save results to the database
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO quiz_results (user_id, answers, score) VALUES (?, ?, ?)',
                   (user_id, str(answers), score))
    conn.commit()
    conn.close()

    return jsonify({'score': score, 'total': len(quiz_data)})

# Route for user registration
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password']

    # Save user to the database
    try:
        conn = sqlite3.connect('quiz.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already taken!'}), 400

# Route for user login (for later use)
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']

    # Check user credentials
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful!', 'user_id': user[0]}), 200  # Returning user_id
    else:
        return jsonify({'message': 'Invalid username or password!'}), 401
    

@app.route('/user/<user_id>/results', methods=['GET'])
def get_user_results(user_id):
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()
    cursor.execute('SELECT answers, score FROM quiz_results WHERE user_id = ?', (user_id,))
    results = cursor.fetchall()
    conn.close()

    # Format the results for JSON response
    formatted_results = [{'answers': r[0], 'score': r[1]} for r in results]
    return jsonify(formatted_results)


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
