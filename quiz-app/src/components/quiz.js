import React, { useState, useEffect } from 'react';

function Quiz({ userId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);  // Change to null initially to differentiate between loading and results
  const [loading, setLoading] = useState(true);  // To handle loading state

  // Fetch quiz questions from Flask backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/quiz')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
      });
  }, []);

  // Handle answer selection
  const handleAnswer = (option) => {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    // Move to the next question or submit the quiz if it's the last question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit the quiz once the last question is answered
      submitQuiz(updatedAnswers);
    }
  };

  // Submit quiz to the backend and calculate the score
  const submitQuiz = (userAnswers) => {
    fetch('http://127.0.0.1:5000/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: userAnswers, user_id: userId }),  // Send answers and userId
    })
      .then(response => response.json())
      .then(data => {
        setScore(data.score);  // Store the score from the response
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
    setLoading(true);

    // Fetch new quiz questions to restart the quiz
    fetch('http://127.0.0.1:5000/quiz')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
      });
  };

  // If quiz is completed and score is available, show the result
  if (score !== null) {
    return (
      <div className="result-container">
        <h2 className="header">Score</h2>
        <div className='text'>Du fikk {score} av {questions.length} riktige.</div>
        <button className="try-again-button" onClick={tryAgain}>Prøv igjen</button>
      </div>
    );
  }

  // Show loading message while fetching the quiz
  if (loading) {
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

export default Quiz;
