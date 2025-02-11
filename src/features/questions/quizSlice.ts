import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { QuizQuestion } from '../../types/questions';
import type { NumberOfQuestions, QuizState, Storage } from '../../types/quiz';

const questionSubjects = import.meta.env.VITE_QUIZ_SUBJECTS.split(',').map((item: string): { id: string; name: string } => {
    return {
        id: item,
        name: `${item[0].toUpperCase()}${item.slice(1)}`
    }
});
// why is this not updating on vercel
const initialState: QuizState = {
    prioritiseIncorrect: true,
    subject: { id: 'words', name: 'words' },
    numberOfQuestions: 50,
    score: 0,
    userAnswers: {},
    currentQuestionIndex: 0,
    category: 'basic',
    quizStarted: false,
    currentQuestions: [],
    categories: {
        words: [
            { id: 'basic', name: "Basic" },
            { id: 'definition', name: "Definition Test" },
            { id: 'riddles', name: "Riddles" },
        ],
    },
    storage: {},
    subjects: questionSubjects
};

function makeAnswersData(correctAnswer: string, incorrectAnswers: string[], correctDefinition: string) {
    const answers = [correctAnswer, ...incorrectAnswers.slice(0, 2)].map((answer, index) => {
        return {
            id: index,
            answer,
            correctDefinition
        }
    });

    return answers.sort(() => Math.random() - 0.5);
}

function makeDistractorsRadndomly(data: QuizQuestion[] | [], state: QuizState) {
    const questionCopy = structuredClone(data)?.slice().sort(() => Math.random() - 0.5) || [];

    const category = state?.category || 'definition';

    console.log('data------:', data)
    const questions = questionCopy?.splice(0, 5).map(q => {
        const questionData = {
            // @ts-expect-error ertet
            definition: q.question_data.correct_answer,
            // @ts-expect-error ertet
            basic: q.word_name,
            // @ts-expect-error ertet
            riddles: q.question_data.riddle,
        }
        const correctAnswer = {
            // @ts-expect-error ertet
            definition: q.word_name,
            // @ts-expect-error ertet
            basic: q.question_data.correct_answer,
            // @ts-expect-error ertet
            riddles: q.word_name,
        }

        console.log(q)
        return {
            // @ts-expect-error ertet
            correct_definition: q.question_data.correct_answer,
            // @ts-expect-error ertet
            question: questionData[category],
            // @ts-expect-error ertet
            correct_answer: correctAnswer[category],
            incorrect_answers: [],
            // @ts-expect-error ertet
            explanation: q.ai_definition,
            // @ts-expect-error ertet
            difficulty_level: q.question_data.difficulty,
            // @ts-expect-error ertet
            sound: state?.category !== 'definition' && state?.category !== 'riddles' ? q.sound_url : '',
        }
    });
    console.log('questions---', questionCopy)
    const distractors = questionCopy?.map(q => {
        const definition = {
            // @ts-expect-error ertet
            definition: q.question_data.correct_answer,
            // @ts-expect-error ertet
            basic: q.word_name,
            // @ts-expect-error ertet
            riddles: q.question_data.correct_answer,
        }
        const incorrectAnswer = {
            // @ts-expect-error ertet
            definition: q.word_name,
            // @ts-expect-error ertet
            basic: q.question_data.correct_answer,
            // @ts-expect-error ertet
            riddles: q.word_name,
        }
        return {
            // @ts-expect-error ertet
            definition: definition[category],
            // @ts-expect-error ertet
            incorrect_answer: incorrectAnswer[category],
        }
    })?.slice().sort(() => Math.random() - 0.5) || [];

    questions.forEach((question) => {
        // @ts-expect-error ertet
        question.incorrect_answers = distractors.splice(0, 2).map(d => d);
    });

    return questions;
}

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {

        setNumberOfQuestions(state, action: PayloadAction<NumberOfQuestions>) {
            state.numberOfQuestions = action.payload;
        },
        setCategory(state, action: PayloadAction<{ id: string; name: string }>) {
            state.category = action.payload.id;
        },

        incrementScore(state) {
            state.score += 1;
        },
        resetQuiz(state) {
            state.score = 0;
            state.quizStarted = false;
            state.currentQuestionIndex = 0;
            state.userAnswers = {};
            state.currentQuestions = [];

        },
        setStartQuiz(state) {
            state.quizStarted = true;
        },
        setCurrentQuestions(state, action: PayloadAction<{ questions: QuizQuestion[] | undefined }>) {
            // export interface  QuizQuestion  {
            //     question: string;
            //     correct_answer: string;
            //     incorrect_answers: string[];
            //     explanation: string;
            //     difficulty_level?: string;
            // };
            //  console.log('action.payload.questions', action.payload.questions)

            const pastIncorrectAnswers: string[] = [];
            console.log('state.category', state.category)

            const apiQuestions: QuizQuestion[] = action.payload.questions ?
                makeDistractorsRadndomly(action.payload.questions, state)
                : [];
            // apiQuestions= action.payload.questions
            //     ? structuredClone(action.payload.questions?.map(q => {
            //         return {
            //             // @ts-expect-error ertet
            //             question: state.category === 'definition' ?  q.question_data.riddle: q.name,
            //              // @ts-expect-error ertet
            //             correct_answer: state.category === 'definition' ? q.name : q.question_data.correct_answer ,
            //             // @ts-expect-error ertet
            //             incorrect_answers: q.question_data.incorrect_answers.map(answers => {
            //                 return state.category === 'definition' ? answers.word : answers.definition
            //             }),
            //             // @ts-expect-error ertet
            //             explanation: q.ai_definition,
            //             // @ts-expect-error ertet
            //             difficulty_level: q.question_data.difficulty
            //         }
            //     }))
            //     : [];
            console.log('apiQuestions', apiQuestions)
            const incorrectAnsweredQuestions: QuizQuestion[] = [];
            const indexOfIncorrectQuestions: number[] = [];

            if (state.prioritiseIncorrect && state.storage?.[state.subject.id]?.[state.category]) {
                Object.entries(state.storage[state.subject.id][state.category]).forEach(
                    ([key, value]) => {
                        if (!value) pastIncorrectAnswers.push(key);
                    }
                );
            }

            if (pastIncorrectAnswers.length > 0) {
                apiQuestions.forEach((question, index) => {
                    if (pastIncorrectAnswers.includes(question.question)) {
                        incorrectAnsweredQuestions.push(question);
                        indexOfIncorrectQuestions.unshift(index);
                    }
                });

                if (indexOfIncorrectQuestions.length) {
                    indexOfIncorrectQuestions.forEach((index) => apiQuestions.splice(index, 1));
                }
            }

            const shuffledQuestions = apiQuestions?.slice().sort(() => Math.random() - 0.5) || [];

            let questions: QuizQuestion[] = [];
            if (incorrectAnsweredQuestions.length >= state.numberOfQuestions) {
                questions = incorrectAnsweredQuestions.slice(0, state.numberOfQuestions);
            } else {
                questions = [
                    ...incorrectAnsweredQuestions,
                    ...shuffledQuestions.slice(0, state.numberOfQuestions - incorrectAnsweredQuestions.length),
                ];
            }

            state.numberOfQuestions = questions.length;
            state.currentQuestions = questions.map((question) => ({
                ...question,
                // @ts-expect-error ertet
                questionAnswers: makeAnswersData(question.correct_answer, question.incorrect_answers, question.correct_definition),
            }));
        },

        setUserAnswer(state, action: PayloadAction<{ questionId: number; answer: string }>) {
            const { questionId, answer } = action.payload;

            state.userAnswers[questionId] = answer;
        },
        setNextQuestion(state) {
            state.currentQuestionIndex += 1;
        },
        restartQuiz(state) {
            state.currentQuestionIndex = 0;
            state.score = 0;
            state.userAnswers = {};
        },
        setSubject(state, action: PayloadAction<{ id: string; name: string }>) {
            state.category = state.categories[action.payload.id][0].id;
            state.subject = action.payload;
        },
        setStorageCopy(state, action: PayloadAction<{ quizData: Storage }>) {
            state.storage = action.payload.quizData;
        },
        setStorageItem(state, action: PayloadAction<{ isCorrect: boolean }>) {
            const { isCorrect } = action.payload;
            const { subject, category, currentQuestions, currentQuestionIndex } = state;

            // const question = currentQuestions[currentQuestionIndex].question;
            // const questionKey = btoa(question);
            const questionKey = currentQuestions[currentQuestionIndex].question;
            // Safely update the state in storage
            if (subject?.id && category && questionKey) {
                state.storage[subject.id] = state.storage[subject.id] || {}; // Initialize subject if undefined
                state.storage[subject.id][category] = state.storage[subject.id][category] || {}; // Initialize category if undefined
                state.storage[subject.id][category][questionKey] = isCorrect;
            }
        },
        setPrioritiseIncorrect(state, action: PayloadAction<boolean>) {
            state.prioritiseIncorrect = action.payload;
        }
    },
    selectors: {
        selectCurrentQuestionIndex: quiz => quiz.currentQuestionIndex,

        selectNumberOfQuestions(state) {
            return state.numberOfQuestions;
        },

        selectUserAnswer(state, questionId: number) {
            return state.userAnswers[questionId] || null;
        },
        selectScore(state) {
            return state.score;
        },
        selectIsQuizFinished(state) {
            return state.currentQuestionIndex === state.numberOfQuestions;
        },
        selectQuizStarted(state) {
            return state.quizStarted;
        },
        selectCategory(state) {
            return state.category;
        },
        selectSubject(state) {
            return state.subject;
        },
        selectCurrentQuestion(state, index: number) {
            return state.currentQuestions[index];
        },
        selectCorrectAnswer(state, index: number) {
            return state.currentQuestions[index].correct_answer;
        },
        selectQuizReady(state) {
            return state.currentQuestions.length > 0;
        },
        selectStorage(state) {
            return state.storage;
        },
        selectStorageItem(state, questionKey: string) {
            const { subject, category } = state;
            //const questionKey = btoa(question);

            return state.storage?.[subject.id]?.[category]?.[questionKey] ?? null;

        },
        selectPrioritiseIncorrect(state) {
            return state.prioritiseIncorrect;
        },
        selectSubjectInfo(state) {
            const category = state.categories[state.subject.id].find((category) => category.id === state.category)?.name;

            return { subject: state.subject.name, category };
        }
    },
    // extraReducers: (builder) => {
    //     // Add any extra reducers here if needed
    // },
});
const selectQuizState = (state: RootState) => state.quiz;
export const selectCurrentQuestions = (state: RootState) => selectQuizState(state).currentQuestions;
export const selectUserAnswers = (state: RootState) => selectQuizState(state).userAnswers;
export const selectSubjectCategories = (state: RootState) => {
    return selectQuizState(state).categories[selectQuizState(state).subject.id];
}
export const selectSubjects = (state: RootState) => selectQuizState(state).subjects;
export const {
    selectCurrentQuestionIndex,
    selectUserAnswer,
    selectScore,
    selectIsQuizFinished,
    selectQuizStarted,
    selectCategory,
    selectNumberOfQuestions,
    selectSubject,
    selectCurrentQuestion,
    selectCorrectAnswer,
    selectQuizReady,
    selectStorage,
    selectStorageItem,
    selectPrioritiseIncorrect,
    selectSubjectInfo
} = quizSlice.selectors;
export const {
    setCategory,
    setNumberOfQuestions,
    incrementScore,
    resetQuiz,
    setStartQuiz,
    setCurrentQuestions,
    setUserAnswer,
    setNextQuestion,
    restartQuiz,
    setSubject,
    setStorageCopy,
    setStorageItem,
    setPrioritiseIncorrect
} = quizSlice.actions;

export const selectCurrentQuestionData = createSelector(
    [
        selectCurrentQuestionIndex,
        // (state) => state.quiz.currentQuestions,
        selectCurrentQuestions,
        selectUserAnswers,
    ],
    (questionIndex, currentQuestions, userAnswers) => {
        const currentQuestion = currentQuestions[questionIndex] || {};

        return {
            questionIndex,
            currentQuestion,
            correctAnswer: currentQuestion?.correct_answer,
            userAnswer: userAnswers[questionIndex] || null,
            sound: currentQuestion?.sound
        };
    }
);

export default quizSlice.reducer;
