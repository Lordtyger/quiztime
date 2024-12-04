import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { QuizQuestion } from '../../types/questions';
import type { NumberOfQuestions, } from '../../types/quiz';
import type { FlashCardState } from '../../types/flashcards';
import type { FlashCardApiResponse } from '../../types/flashcards';
import { formatCategoryLabel } from '../../helpers/misc';
import { current } from '@reduxjs/toolkit';

const flashCardSubjects = JSON.parse(import.meta.env.VITE_FLASH_SUBJECTS);

const initialState: FlashCardState = {
    flashStarted: false,
    category: null,
    numberOfCards: 10,
    currentCards: [],
    currentQuestionIndex: 0,
    flashCards: {},
    categories: [],
    flashCardSubjects,
    subject: null,
    flashCardStarted: false,
};


export const flashCardSlice = createSlice({
    name: 'flashCards',
    initialState,
    reducers: {

        setNumberOfCards(state, action: PayloadAction<NumberOfQuestions>) {
            state.numberOfCards = action.payload;
        },
        setCategory(state, action: PayloadAction<{ id: string; name: string }>) {
            state.category = action.payload;
        },

        resetQuiz(state) {
            state.currentQuestionIndex = 0;
        },
        setStartFlashCards(state) {
            state.flashStarted = true;
        },
        setCurrentQuestions(state) {
            if(!state.subject || !state.category) return;
            const flashCards = state.flashCards[state.subject.id ][state.category.id].sort(() => Math.random() - 0.5);

            state.currentCards = flashCards.slice(0, state.numberOfCards);
        },

        setNextCard(state) {
            state.currentQuestionIndex = state.currentQuestionIndex + 1 < state.currentCards.length ? state.currentQuestionIndex + 1 : state.currentQuestionIndex;
        },
        setPrevCard(state) {
            state.currentQuestionIndex = state.currentQuestionIndex - 1 > -1 ? state.currentQuestionIndex - 1 : state.currentQuestionIndex;
        },
        restartQuiz(state) {
            state.currentQuestionIndex = 0;

        },
        setSubject(state, action: PayloadAction<{ id: string; name: string }>) {
            state.subject = action.payload;
        },
        setCacheFlashCards(state, action: PayloadAction<{ flashCards: FlashCardApiResponse; key: string }>) {
            state.flashCards[action.payload.key] = action.payload.flashCards;
        },
        setCategories(state, action: PayloadAction<string>) {
            state.categories = Object.keys(state.flashCards[action.payload]).map(key => key);
            state.category = {id: state.categories[0].split(' ').join('_'), name: formatCategoryLabel(state.categories[0])};
        },
        resetFlashCards(state) {
            state.flashStarted = false;
            state.currentQuestionIndex = 0;
            state.currentCards = [];
            state.category = null;
            state.subject = null;
        }
    },
    selectors: {
        selectCurrentCardIndex: (state) => state.currentQuestionIndex,

        selectNumberOfQuestions(state) {
            return state.numberOfCards;
        },
        selectCurrentQuestionCount(state) {
            return state.currentCards.length;
        },
        selectIsQuizFinished(state) {
            return state.currentQuestionIndex === state.numberOfCards;
        },
        selectFlashStarted(state) {
            return state.flashStarted;
        },
        selectCategory(state) {
            return state.category;
        },
        selectSubject(state) {
            return state.subject;
        },
        selectCurrentFlashCard(state) {
            return state.currentCards[state.currentQuestionIndex];
        },
        selectCorrectAnswer(state, index: number) {
            //  return state.currentQuestions[index].correct_answer;
        },
        selectQuizReady(state) {
            // return state.currentQuestions.length > 0;
        },
        selectFlashCardSubjects(state) {
            return state.flashCardSubjects;
        },
        selectSubjectLoaded(state, subject: string) {
            return state.flashCards[subject] !== undefined;
        },
        selectCategories(state) {
            return state.categories;
        },

    },
    extraReducers: (builder) => {
        // Add any extra reducers here if needed
    },
});
const selectQuizState = (state: RootState) => state.quiz;
export const selectCurrentQuestions = (state: RootState) => selectQuizState(state).currentQuestions;
export const selectUserAnswers = (state: RootState) => selectQuizState(state).userAnswers;
export const selectSubjectCategories = (state: RootState) => {
    return selectQuizState(state).categories[selectQuizState(state).subject.id];
}
export const selectSubjects = (state: RootState) => selectQuizState(state).subjects;
export const {
    selectCurrentCardIndex,
    selectIsQuizFinished,
    selectFlashStarted,
    selectCategory,
    selectNumberOfQuestions,
    selectSubject,
    selectCurrentFlashCard,
    selectCorrectAnswer,
    selectQuizReady,
    selectFlashCardSubjects,
    selectSubjectLoaded,
    selectCategories,
    selectCurrentQuestionCount,
} = flashCardSlice.selectors;
export const {
    setCategory,
    setNumberOfCards,
    resetQuiz,
    setStartFlashCards,
    setCurrentQuestions,
    setNextCard,
    restartQuiz,
    setSubject,
    setCacheFlashCards,
    setCategories,
    setPrevCard,
    resetFlashCards,
} = flashCardSlice.actions;

// export const selectCurrentQuestionData = createSelector(
//     [
//         selectCurrentQuestionIndex,
//         // (state) => state.quiz.currentQuestions,
//         selectCurrentQuestions,
//         selectUserAnswers,
//     ],
//     (questionIndex, currentQuestions, userAnswers) => {
//         const currentQuestion = currentQuestions[questionIndex] || {};

//         return {
//             questionIndex,
//             currentQuestion,
//             correctAnswer: currentQuestion?.correct_answer,
//             userAnswer: userAnswers[questionIndex] || null,
//         };
//     }
// );

export default flashCardSlice.reducer;
