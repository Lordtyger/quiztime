import { FaFaceFrown, FaFaceGrinBeam, FaFaceMeh } from 'react-icons/fa6';
export default function Question({
    questionTxt,
    userScore,
    numberOfQuestions,
    questionIndex,
    pastAnswerAttempt
}: {
    questionTxt: string
    userScore: number,
    numberOfQuestions: number,
    questionIndex: number,
    pastAnswerAttempt: boolean | null
}) {

    return (
        <div className='question-container'>
            <div className='question-header'>
                <p className='score'>Score: {userScore}</p>
                <p className='question-count'>Question: {questionIndex + 1} of {numberOfQuestions}</p>
                <div className='past-answer-attempt'>
                    {pastAnswerAttempt ?
                        <span style={{ color: '#66FF99' }}><FaFaceGrinBeam /></span>
                        : pastAnswerAttempt === null ? <FaFaceMeh /> : <span style={{ color: 'red' }}><FaFaceFrown /></span>}
                </div>
            </div>
            <hr />
            <h2 className='question' dangerouslySetInnerHTML={{ __html: questionTxt }}></h2>
        </div>
    );
}