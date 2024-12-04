//import { Questions } from "../components/Questions"
import { useAppSelector } from '../app/hooks';
import StartFlashCards from "../components/StartFlashCards";
import {selectFlashStarted } from "../features/flashcards/flashCardSlice";
import FlashCardQuestions from "./FlashCardQuestions";

// import { selectQuizStarted } from '../features/questions/quizSlice';


const FlashCards = () => {
    const quizStarted = useAppSelector(selectFlashStarted);

    console.log('quizStarted', quizStarted);
    return (
        <>
                
                { 
                    !quizStarted ? <StartFlashCards /> : <FlashCardQuestions />
                }

                
           

        </>
    )
}

export default FlashCards