export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  userAnswers: string[];
}
