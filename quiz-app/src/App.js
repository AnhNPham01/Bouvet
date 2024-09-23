import React, { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  // Fetch quiz questions from Flask backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/quiz')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  }, []);

  // Handle answer selection
  const handleAnswer = (option) => {
    setAnswers([...answers, option]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit the final answers when the last question is answered
      submitQuiz([...answers, option]);
    }
  };

  // Submit the quiz answers to Flask backend
  const submitQuiz = (finalAnswers) => {
    fetch('http://127.0.0.1:5000/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: finalAnswers }),
    })
      .then(response => response.json())
      .then(data => {
        setScore(data.score); // Set the score received from the backend
      })
      .catch(error => {
        console.error('Error submitting quiz:', error);
      });
  };

  // Reset quiz state
  const tryAgain = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(null);
    fetch('http://127.0.0.1:5000/quiz')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  };

  // If quiz is completed, show score
  if (score !== null) {
    return (
      <div>
        <div>Du fikk {score} av {questions.length} riktige.</div>
        <button onClick={tryAgain}>Prøv igjen</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Laster spørsmål...</div>;
  }

  return (
    <div>
      <h2>Spørsmål {currentQuestion + 1} av {questions.length}</h2>
      <h3>{questions[currentQuestion].question}</h3>
      <div>
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
