import Markdown from 'react-markdown';
import { detectFormat } from '../helpers/misc';
import type AnswerButtonProps from '../types/models/answerbuttons';

export default function AnswerButtons({
    questionAnswers,
    userAnswer,
    correctAnswer,
    handleUserAnswer }: AnswerButtonProps): JSX.Element {

    const buildButtons = () => {
        return questionAnswers.map((qAnswer, index) => {
            let btnClass = '';
            const answerFormat = detectFormat(qAnswer.answer);
            const dangerouseHtml = answerFormat === 'HTML' || answerFormat === 'Unknown';

            if (userAnswer !== null) {
                if (correctAnswer === qAnswer.answer) {
                    btnClass = 'correct-answer';
                } else if (userAnswer === qAnswer.answer) {
                    btnClass = 'incorrect-answer';
                }
            }

            return (
                    <div  key={qAnswer.id} >
                        {
                            dangerouseHtml ?
                                <button
                                    className={btnClass}
                                    style={{ pointerEvents: userAnswer !== null ? 'none' : 'initial', width: '100%' }}
                                    // key={qAnswer.id}
                                    onClick={() => handleUserAnswer(qAnswer.answer)}
                                    dangerouslySetInnerHTML={{ __html: qAnswer.answer }}
                                />
                                : <button
                                    className={btnClass}
                                    style={{ pointerEvents: userAnswer !== null ? 'none' : 'initial', width: '100%' }}
                                    // key={qAnswer.id}
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