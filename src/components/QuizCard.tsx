import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Question } from '../types';
import { cn } from '../lib/utils';

interface QuizCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  showFeedback: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  onSelect,
  showFeedback,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-black/5 p-8"
    >
      <div className="mb-6">
        <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          {question.category}
        </span>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-900 leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === question.correctAnswer;
          const isWrong = isSelected && !isCorrect;

          return (
            <button
              key={index}
              disabled={showFeedback}
              onClick={() => onSelect(option)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200",
                !showFeedback && "hover:border-emerald-500 hover:bg-emerald-50/30 border-zinc-200 text-zinc-700",
                showFeedback && isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700",
                showFeedback && isWrong && "border-rose-500 bg-rose-50 text-rose-700",
                showFeedback && !isCorrect && !isWrong && "border-zinc-100 text-zinc-400 opacity-50",
                !showFeedback && isSelected && "border-emerald-500 bg-emerald-50"
              )}
            >
              <span className="font-medium">{option}</span>
              {showFeedback && isCorrect && <Check className="w-5 h-5" />}
              {showFeedback && isWrong && <X className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100"
        >
          <p className="text-sm text-zinc-600 leading-relaxed">
            <span className="font-semibold text-zinc-900">Explanation: </span>
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
