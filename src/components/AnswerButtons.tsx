import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { detectFormat } from '../helpers/misc';
import type AnswerButtonProps from '../types/models/answerbuttons';
import { useAppSelector } from '../app/hooks';
import { selectSubjectInfo } from '../features/questions/quizSlice';



export default function AnswerButtons({
    questionAnswers,
    userAnswer,
    correctAnswer,
    handleUserAnswer,
}: AnswerButtonProps): JSX.Element {

    useEffect(() => {
        console.log('User answer changed, triggering re-render');
    }, [userAnswer]);

    console.log('questionAnswers', questionAnswers);
    const { category } = useAppSelector(selectSubjectInfo);
    const buildButtons = () => {
        return questionAnswers.map((qAnswer) => {

            let showIncorrect = false;
            let showCorrect = false;
            const answerStyle = { background: '' };
            const answerFormat = detectFormat(qAnswer.answer);
            console.log('answerFormat', answerFormat);
            const dangerouseHtml = answerFormat === 'HTML' || answerFormat === 'Unknown';

            if (userAnswer !== null) {
                if (correctAnswer === qAnswer.answer) {
                    answerStyle.background = 'green'
                    showCorrect = category?.toLowerCase() === 'riddles'
                } else if (userAnswer === qAnswer.answer) {
                    showIncorrect = true;
                    answerStyle.background = 'red'
                }
            }

            console.log('showCorrectshowCorrectshowCorrectshowCorrect', qAnswer);

            return (
                <div key={qAnswer.id} >
                    {
                        dangerouseHtml ?
                            <div>
                                <button

                                    // className={btnClass}
                                    style={{ pointerEvents: userAnswer !== null ? 'none' : 'initial', width: '100%', ...answerStyle }}
                                    onClick={() => handleUserAnswer(qAnswer.answer)}
                                    // @ts-expect-error ertet
                                    dangerouslySetInnerHTML={{ __html: typeof qAnswer.answer === 'object' ? qAnswer.answer.incorrect_answer : qAnswer.answer }}
                                />

                                <div className ="incorrect-answer-container">
                                    {/* @ts-expect-error ertet */}
                                    <p style={{ display: showCorrect ? null : 'none' }} className='incorrect-definition'>{showCorrect && qAnswer.correctDefinition}</p>
                                    {/* @ts-expect-error ertet */}
                                    <p style={{ display: showIncorrect ? null : 'none' }} className='incorrect-definition'>{showIncorrect && qAnswer.answer.definition}</p>
                                </div>
                            </div>
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