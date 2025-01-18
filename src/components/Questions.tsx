import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useGetQuestionsQuery } from "../features/questions/questionsApiSlice";
import { setCurrentQuestions } from "../features/questions/quizSlice";

import {
    selectCategory,
    selectSubject,
    selectQuizReady
} from "../features/questions/quizSlice";
import { AskQuestions } from "./AskQuestions";

export const Questions = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const currentCatId = useAppSelector(selectCategory);
    // const numberOfQuestions = useAppSelector(selectNumberOfQuestions);
    const quizReady = useAppSelector(selectQuizReady);
    const subject = useAppSelector(selectSubject).id;

    console.log('in heree', quizReady);
    const { data: questionsData, isLoading: questionsLoading }
        = useGetQuestionsQuery({subject,  currentCatId});    

    useEffect(() => {
        if (questionsData?.length) {
            dispatch(setCurrentQuestions({questions: questionsData}));
        }
    }, [questionsData, dispatch]);

    if (questionsLoading ) {
        return <LoadingDisplay />
    }

    if (quizReady) {
        return (
        <AskQuestions/>
        )
    }

    return null
}

const LoadingDisplay = () => (
    <div>
        <h1>Loading...</h1>
    </div>
);

// const ErrorDisplay = () => (
//     <div>
//         <h1>There was an error!!!</h1>
//     </div>
// );