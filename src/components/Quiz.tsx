import { useEffect } from "react";
import { Questions } from "../components/Questions"
import { useAppSelector, useAppDispatch } from '../app/hooks';
import StartQuiz from "../components/StartQuiz";
import { selectQuizStarted, setStorageCopy, selectStorage } from '../features/questions/quizSlice';


const Quiz = () => {
    const dispatch = useAppDispatch();
    const quizStarted = useAppSelector(selectQuizStarted);
    const quizData = useAppSelector(selectStorage);

    useEffect(() => {
        const storedData = localStorage.getItem('quizData');

        dispatch(setStorageCopy({ quizData: storedData ? JSON.parse(storedData) : {} }));
    }, [dispatch]);

    useEffect(() => {
        if (quizData && Object.keys(quizData).length > 0) {
            localStorage.setItem('quizData', JSON.stringify(quizData));
        }
    }, [quizData]);

    return (
        <>
            {
                !quizStarted ? <StartQuiz /> : <Questions />
            }
        </>
    )
}

export default Quiz