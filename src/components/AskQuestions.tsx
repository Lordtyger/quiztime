import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { incrementScore, resetQuiz, restartQuiz, selectCurrentQuestionData, selectNumberOfQuestions, selectScore, selectStorageItem, selectSubjectInfo, setNextQuestion, setStorageItem, setUserAnswer } from '../features/questions/quizSlice';
import AnswerButtons from './AnswerButtons';
import Modal from './Modal';
import Question from './Question';

export function AskQuestions() {
    const [soundUrl, setSoundUrl] = useState<string >('');
    const [showDialog, setShowDialog] = useState(false);
    const dispatch = useAppDispatch();

    const {
        questionIndex,
        currentQuestion,
        correctAnswer,
        userAnswer,
    } = useAppSelector(selectCurrentQuestionData);
    console.log('currentQuestion', currentQuestion);
    const { difficulty_level } = currentQuestion;
 
    const numberOfQuestions = useAppSelector(selectNumberOfQuestions);
    const quizFinished = questionIndex + 1 === numberOfQuestions;
    const userScore = useAppSelector(selectScore);
    const { subject, category } = useAppSelector(selectSubjectInfo);

    const pastAnswerAttempt = useAppSelector(state => selectStorageItem(state, currentQuestion.question));

    const handleUserAnswer = (answer: string,) => {
        if (answer === correctAnswer) {
            dispatch(incrementScore());
        }
        dispatch(setStorageItem({ isCorrect: answer === correctAnswer }));
        dispatch(setUserAnswer({ questionId: questionIndex, answer: answer }));

    }

    const showNextQuestion = () => {
        if (!quizFinished) {
            dispatch(setNextQuestion());
        } else {
            dispatch(resetQuiz());
        }
    }
    useEffect(() => {
        setSoundUrl(currentQuestion.sound);
    }, [currentQuestion]);

    return (
        <div className='quiz-container'>
            {/* <h1>{subject}: {category}</h1> */}
            <Question
                category={category || ''}
                difficulty_level={difficulty_level || ''}
                questionTxt={currentQuestion.question}
                userScore={userScore}
                numberOfQuestions={numberOfQuestions}
                questionIndex={questionIndex}
                pastAnswerAttempt={pastAnswerAttempt}
                sound={soundUrl}
            />
            {/* <div key={userAnswer}> */}
            <AnswerButtons
                questionAnswers={currentQuestion.questionAnswers}
                userAnswer={userAnswer}
                correctAnswer={correctAnswer}
                handleUserAnswer={handleUserAnswer}
                setSoundUrl={setSoundUrl}
            />
            {/* </div> */}
            <div className="control-buttons">
                <div className='quiz-in-progress-btns'>
                    {currentQuestion?.explanation && userAnswer && (
                        <button onClick={() => setShowDialog(true)}> Explanation</button>
                    )}

                    {!quizFinished && userAnswer && (
                        <button className="next-btn" onClick={showNextQuestion}>Next </button>
                    )}
                    {quizFinished && userAnswer && (
                        <div className='quiz-finished-btns'>
                        <button onClick={() => window.location.reload()}>New Quiz</button>
                        <button onClick={() => dispatch(restartQuiz())}>Replay</button>
                        </div>
                    )}
                </div>
                {/* <div className='quiz-finished-btns '>
                    {quizFinished && userAnswer && (
                        <button onClick={showNextQuestion}>New Quiz</button>
                    )}

                </div> */}
            </div>
            <Modal
                showDialog={showDialog}
                onClose={setShowDialog}
                explanation={currentQuestion.explanation}
            />
        </div>
    )
}


