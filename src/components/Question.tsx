import { FaFaceFrown, FaFaceGrinBeam, FaFaceMeh } from 'react-icons/fa6';
import PlaySound from './PlaySound';
export default function Question({
    difficulty_level,
    questionTxt,
    userScore,
    numberOfQuestions,
    questionIndex,
    pastAnswerAttempt,
    sound,
    category,
}: {
    difficulty_level: string,
    questionTxt: string
    userScore: number,
    numberOfQuestions: number,
    questionIndex: number,
    pastAnswerAttempt: boolean | null,
    sound: string
    category: string
}) {
    return (
        <div className='question-container'>
            <div className='question-header'>
                
                {/* {difficulty_level && <span>Level: {difficulty_level}</span>} */}
                <p className='score'>Score: {userScore}</p>
                <p className='question-count'>Question: {questionIndex + 1} of {numberOfQuestions}</p>
                <div className='past-answer-attempt'>
                    {pastAnswerAttempt ?
                        <span style={{ color: '#66FF99' }}><FaFaceGrinBeam /></span>
                        : pastAnswerAttempt === null ? <FaFaceMeh /> : <span style={{ color: 'red' }}><FaFaceFrown /></span>}
                </div>
            </div>
            <hr />
            <div className='question-body'>

                { category.toLowerCase() !== 'riddles' && <h2 className='question' dangerouslySetInnerHTML={{ __html: questionTxt }}></h2>}
                { category.toLowerCase() === 'riddles' && <div className='riddle-box' dangerouslySetInnerHTML={{ __html: questionTxt }}></div>}
                <div>{sound && <PlaySound soundUrl={sound} />}</div>
            </div>
            
        </div>
    );
}