"use client";

import React, { useState, useEffect } from "react";
import { fetchQuestion, Difficulty, QuestionState } from "../../API";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import QuestionCards from "../../components/QuestionCards";

export default function Home() {
  type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
  };

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [answerSelected, setAnswerSelected] = useState(false);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuestion(TOTAL_QUESTIONS, Difficulty.EASY);
      setQuestions(newQuestions);

      localStorage.setItem('cachedQuestions', JSON.stringify(newQuestions));

      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setAnswerSelected(false);
    } catch (error) {
      console.error("Error fetching questions, loading from cache:", error);
      const cachedQuestions = localStorage.getItem('cachedQuestions');
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
      }
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    const nextQ = number + 1;

    if (nextQ < TOTAL_QUESTIONS) {
      setNumber(nextQ);
      setAnswerSelected(false);
    } else {
      setGameOver(true);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver && !answerSelected) {
      const userAnswer = e.currentTarget.value;

      const isCorrect = userAnswer === questions[number].correct_answer;

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      const answerObject: AnswerObject = {
        question: questions[number].question,
        answer: userAnswer,
        correct: isCorrect,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswers((prevAnswers) => [...prevAnswers, answerObject]);
      setAnswerSelected(true);
    }
  };

  return (
    <div className="PAGEQUESTION">
      <h1 className="bolder center">Quiz App</h1>
      <div className="textcenter">

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startQuiz}>
            Begin Quiz
          </button>
        ) : null}

        {!gameOver && <p className="score center">Score: {score}/10</p>}
        {loading && <p className="loading center">Loading...</p>}

        {!loading && !gameOver && questions.length > 0 && (
          <QuestionCards
            questionnumber={number + 1}
            totalQuestion={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            useranswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
            correctAnswer={questions[number].correct_answer}
            answerSelected={answerSelected}
          />
        )}
        <div className="Next1">
          {!loading && !gameOver && answerSelected && number !== TOTAL_QUESTIONS - 1 && (
            <Button className="next" variant="success" onClick={nextQuestion}>
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const swCode = `
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('quiz-app-cache').then((cache) => {
            return cache.addAll(['/', '/index.html', '/style.css', '/script.js']);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
`;

if (typeof window !== 'undefined') {
  const blob = new Blob([swCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);

  navigator.serviceWorker.register(url).then(() => {
    console.log('Service Worker registered');
  });
}
