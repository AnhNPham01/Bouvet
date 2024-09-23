import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

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
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    // Check if the answer is correct and update the score
    if (option === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to the next question or show result
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If it's the last question, show the result directly
      setCurrentQuestion(currentQuestion + 1); // Move to the result state
    }
  };

  // Reset quiz state
  const tryAgain = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    fetch('http://127.0.0.1:5000/quiz')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  };

  // If quiz is completed, show score
  if (currentQuestion === questions.length) {
    return (
      <div className="result-container">
        <h2 className="question">Score</h2>
        <div>Du fikk {score} av {questions.length} riktige.</div>
        <button className="try-again-button" onClick={tryAgain}>Prøv igjen</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Laster spørsmål...</div>;
  }

  return (
    <div className="quiz-container">
      <h2 className="question"> {currentQuestion + 1}. {questions[currentQuestion].question}</h2>
      <ul className="options-list">
        {questions[currentQuestion].options.map((option, index) => (
          <li key={index} className="option" onClick={() => handleAnswer(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
