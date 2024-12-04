import {restartQuiz} from '../features/questions/quizSlice';
export default function QuizControlButtons({
    quizFinished,
    userAnswer,
    showNextQuestion,
    currentQuestion
}: {
    quizFinished: boolean,
    userAnswer: string | null,
    showNextQuestion: () => void,
    currentQuestion: Question   
}) {
  
    return (
        <div className="b-buttons">
                    {!quizFinished && userAnswer && (
                        <button onClick={showNextQuestion}>Next Question</button>
                    )}
                    
                    {currentQuestion?.explanation && userAnswer && (
                        <button onClick={() => setShowDialog(true)}>Show Explanation</button>
                    )}
                    {quizFinished && userAnswer && (
                        <button onClick={showNextQuestion}>New Quiz</button>
                    )}
                    {quizFinished && userAnswer && (
                        <button onClick={() => dispatch(restartQuiz())}>Restart</button>
                    )}
                </div>
    )
}