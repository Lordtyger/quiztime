import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { detectFormat } from '../helpers/misc';
import type AnswerButtonProps from '../types/models/answerbuttons';


export default function AnswerButtons({
    questionAnswers,
    userAnswer,
    correctAnswer,
    handleUserAnswer }: AnswerButtonProps): JSX.Element {

    useEffect(() => {
        console.log('User answer changed, triggering re-render');
    }, [userAnswer]);


    const buildButtons = () => {
        return questionAnswers.map((qAnswer) => {
            const answerStyle = {background: ''};
            const answerFormat = detectFormat(qAnswer.answer);
            const dangerouseHtml = answerFormat === 'HTML' || answerFormat === 'Unknown';

            if (userAnswer !== null) {
                if (correctAnswer === qAnswer.answer) {
                    answerStyle.background = 'green'
                } else if (userAnswer === qAnswer.answer) {
                    answerStyle.background = 'red'
                }
            }

            return (
                <div key={qAnswer.id} >
                    {
                        dangerouseHtml ?
                            <button

                                // className={btnClass}
                                style={{ pointerEvents: userAnswer !== null ? 'none' : 'initial', width: '100%', ...answerStyle }}
                                onClick={() => handleUserAnswer(qAnswer.answer)}
                                dangerouslySetInnerHTML={{ __html: qAnswer.answer }}
                            />
                            : <button
                                // className={btnClass}
                                style={{ pointerEvents: userAnswer !== null ? 'none' : 'initial', width: '100%', ...answerStyle }}
                                onClick={() => handleUserAnswer(qAnswer.answer)}
                            >
                                <Markdown>{qAnswer.answer}</Markdown>
                            </button>
                    }
                </div>

            );
        });
    };
    return (
        <div className="answer-buttons" >
            {buildButtons()}
        </div>
    )
}