/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, RefreshCcw, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Question, QuizState } from './types';
import { generateQuestions } from './services/geminiService';
import { QuizCard } from './components/QuizCard';
import { cn } from './lib/utils';

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    const questions = await generateQuestions(5, difficulty);
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      userAnswers: [],
    });
    setLoading(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = quizState!.questions[quizState!.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setQuizState(prev => ({
      ...prev!,
      score: isCorrect ? prev!.score + 1 : prev!.score,
      userAnswers: [...prev!.userAnswers, answer],
    }));
  };

  const nextQuestion = () => {
    if (quizState!.currentQuestionIndex + 1 < quizState!.questions.length) {
      setQuizState(prev => ({
        ...prev!,
        currentQuestionIndex: prev!.currentQuestionIndex + 1,
      }));
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizState(prev => ({
        ...prev!,
        isFinished: true,
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Brain className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Grammar Guru</h1>
        </div>
        {quizState && !quizState.isFinished && (
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-zinc-500">
              Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
            </div>
            <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          {!quizState && !loading && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-lg"
            >
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <BookOpen className="w-20 h-20 text-emerald-600" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full border-4 border-zinc-50"
                  />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-4">Master English Grammar</h2>
              <p className="text-zinc-600 mb-10 leading-relaxed">
                Test your skills with AI-generated questions tailored to your level. 
                Improve your writing and speaking with instant feedback.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {DIFFICULTY_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-medium transition-all border",
                      difficulty === level
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <button
                onClick={startQuiz}
                className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2 mx-auto"
              >
                Start Quiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              <p className="text-zinc-500 font-medium">Generating your personalized quiz...</p>
            </motion.div>
          )}

          {quizState && !quizState.isFinished && (
            <div key="quiz" className="w-full flex flex-col items-center gap-8">
              <QuizCard
                question={quizState.questions[quizState.currentQuestionIndex]}
                selectedAnswer={selectedAnswer}
                onSelect={handleAnswerSelect}
                showFeedback={showFeedback}
              />
              
              {showFeedback && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={nextQuestion}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                  {quizState.currentQuestionIndex + 1 === quizState.questions.length ? 'See Results' : 'Next Question'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          )}

          {quizState?.isFinished && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white p-12 rounded-3xl shadow-sm border border-black/5 max-w-md w-full"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">Quiz Complete!</h2>
              <p className="text-zinc-500 mb-8">You've finished the {difficulty} level quiz.</p>
              
              <div className="text-6xl font-black text-emerald-600 mb-2">
                {quizState.score}/{quizState.questions.length}
              </div>
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-10">Your Score</p>

              <div className="space-y-3">
                <button
                  onClick={startQuiz}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full py-4 bg-white text-zinc-600 rounded-2xl font-semibold border border-zinc-200 hover:bg-zinc-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-zinc-400 text-sm">
        Powered by Gemini AI • Build your grammar skills daily
      </footer>
    </div>
  );
}
