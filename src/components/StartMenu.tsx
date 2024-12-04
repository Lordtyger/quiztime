import type { GameType } from '../types/quiz';
export default function StartMenu({setGameType}:  {setGameType: (gameType: GameType) => void }) {
    return (
        <div className="start-menu-container">
            <div className="start-menu">
                <button onClick={() => setGameType('quiz')}>Quiz</button>
                <button onClick={() => setGameType('flashcards')}>Flash Cards</button>
            </div>
        </div>
    );
}