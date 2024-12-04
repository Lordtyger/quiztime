
import type { QuizQuestion } from './questions';

// Predefined number of questions
export type NumberOfQuestions = 10 | 20 | 30 | 40 | 50;

// Represents an answer option for a question
export interface Question {
    id: number; // Unique identifier for the answer
    answer: string; // The text of the answer
}

// Represents the structure of a current quiz question
export interface CurrentQuestion extends QuizQuestion {
    questionAnswers: Question[]; // List of possible answers for the question
}

// Storage structure for tracking user progress
export type Storage = {
    [subjectId: string]: {
        [categoryId: string]: {
            [questionId: string]: boolean; // Tracks if a question was answered correctly
        };
    };
};

// Represents the state of the quiz application
export interface QuizState {
    prioritiseIncorrect: boolean; // Should incorrect answers be prioritized in the next quiz?
    subject: {
        id: string; // Unique identifier for the subject
        name: string; // Name of the subject
    };
    numberOfQuestions: number; // Number of questions in the quiz
    score: number; // Current user score
    userAnswers: {
        [questionId: string]: string; // Maps question IDs to the user's answers
    };
    currentQuestionIndex: number; // Index of the current question in the quiz
    category: string; // The selected category
    quizStarted: boolean; // Has the quiz started?
    currentQuestions: CurrentQuestion[]; // Array of questions currently in the quiz
    categories: {
        [subjectId: string]: { // Maps subject IDs to available categories
            id: string; // Unique category identifier
            name: string; // Name of the category
        }[];
    };
    subjects: {
        id: string; // Unique identifier for the subject
        name: string; // Name of the subject
    }[];
    storage: Storage; // Tracks user progress for questions
}

export type GameType = 'quiz' | 'flashcards' | 'none';