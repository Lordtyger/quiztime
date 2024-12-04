import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { incrementScore, resetQuiz, restartQuiz, selectCurrentQuestionData, selectNumberOfQuestions, selectScore, selectStorageItem, selectSubjectInfo, setNextQuestion, setStorageItem, setUserAnswer } from '../features/questions/quizSlice';
import AnswerButtons from './AnswerButtons';
import Modal from './Modal';
import Question from './Question';

export function AskQuestions() {
    const [showDialog, setShowDialog] = useState(false);
    const dispatch = useAppDispatch();

    const {
        questionIndex,
        currentQuestion,
        correctAnswer,
        userAnswer,
    } = useAppSelector(selectCurrentQuestionData);

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

    return (
        <div className='quiz-container'>
            <h1>{subject}: {category}</h1>
            <Question
                questionTxt={currentQuestion.question}
                userScore={userScore}
                numberOfQuestions={numberOfQuestions}
                questionIndex={questionIndex}
                pastAnswerAttempt={pastAnswerAttempt}
            />
            {/* <div key={userAnswer}> */}
                <AnswerButtons
                    questionAnswers={currentQuestion.questionAnswers}
                    userAnswer={userAnswer}
                    correctAnswer={correctAnswer}
                    handleUserAnswer={handleUserAnswer}
                />
            {/* </div> */}
            <div className="control-buttons">
                <div className='quiz-in-progress-btns'>
                    {currentQuestion?.explanation && userAnswer && (
                        <button onClick={() => setShowDialog(true)}> Explanation</button>
                    )}

                    {!quizFinished && userAnswer && (
                        <button onClick={showNextQuestion}>Next </button>
                    )}
                    {quizFinished && userAnswer && (
                        <button onClick={() => dispatch(restartQuiz())}>Restart</button>
                    )}
                </div>
                <div className='quiz-finished-btns '>
                    {quizFinished && userAnswer && (
                        <button onClick={showNextQuestion}>New Quiz</button>
                    )}

                </div>
            </div>
            <Modal
                showDialog={showDialog}
                onClose={setShowDialog}
                explanation={currentQuestion.explanation}
            />
        </div>
    )
}


