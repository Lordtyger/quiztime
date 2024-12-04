import { useAppDispatch, useAppSelector } from '../app/hooks';
import { resetFlashCards, selectCurrentCardIndex, selectCurrentFlashCard, selectCurrentQuestionCount, setNextCard, setPrevCard } from "../features/flashcards/flashCardSlice";
import FlashCard from './FlashCard';
export default function FlashCardQuestions() {
    const dispatch = useAppDispatch();
    const currentQuestionCount = useAppSelector(selectCurrentQuestionCount);
    const currentCardIndex = useAppSelector(selectCurrentCardIndex);
    const currentCard = useAppSelector(selectCurrentFlashCard);
    const handleReset = () => {
        dispatch(resetFlashCards());
    };

    const handleCardNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            dispatch(setPrevCard());
        } else {
            dispatch(setNextCard());
        }
    }

    const prevDisabled = currentCardIndex === 0;
    const nextDisabled = currentCardIndex === currentQuestionCount - 1;
    return (
        <>
            <div>Flash {currentQuestionCount}</div>
            <FlashCard card={currentCard} />
            <div>
                <button onClick={() => handleCardNavigation('prev')} disabled={prevDisabled}>Prev</button>
                <button onClick={() => handleCardNavigation('next')} disabled={nextDisabled}>Next</button>
            </div>
            <div>
                <button onClick={handleReset}>Reset</button>
            </div>
        </>
    )
}