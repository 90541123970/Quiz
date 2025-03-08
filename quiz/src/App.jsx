import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=17&difficulty=medium&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(
          data.results.map((q, index) => ({
            ...q,
            id: index,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          }))
        );
      });
  }, []);

  const handleSelect = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setScore(null);
    setQuestions([]);
    fetch("https://opentdb.com/api.php?amount=10&category=17&difficulty=medium&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(
          data.results.map((q, index) => ({
            ...q,
            id: index,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          }))
        );
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Quiz App</h1>
      {questions.length > 0 ? (
        <>
          {questions.map((q) => (
            <div key={q.id} className="card mb-3 p-3">
              <h3 className="card-title">{q.question}</h3>
              {q.answers.map((answer, i) => (
                <div key={i} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    value={answer}
                    checked={userAnswers[q.id] === answer}
                    onChange={() => handleSelect(q.id, answer)}
                  />
                  <label className="form-check-label">{answer}</label>
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-primary w-100" onClick={handleSubmit}>Submit</button>
        </>
      ) : (
        <p className="text-center">Loading questions...</p>
      )}
      {score !== null && (
        <div className="text-center mt-4">
          <h2>Your Score: {score} / 5</h2>
          <button className="btn btn-success" onClick={handleRestart}>Take Another Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
