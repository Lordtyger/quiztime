import type {Question} from '../quiz';
export default interface AnswerButtonProps {
    questionAnswers:Question[],
    userAnswer: string | null,
    correctAnswer: string,
    handleUserAnswer: (answer: string) => void
    setSoundUrl: (sound: string) => void
}