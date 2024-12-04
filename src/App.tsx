import { useState } from "react"
import Quiz from "./components/Quiz"
import FlashCards from "./components/FlashCards";
import type { GameType } from "./types/quiz";
import StartMenu from './components/StartMenu';

const App = () => {
    const [gameType, setGameType] = useState<GameType>('none');

    return (
        <div className="App">
            <div className="quiz-content">
                {gameType === 'none' && <StartMenu setGameType={setGameType} />}
                {gameType === 'quiz' && <Quiz />}
                {gameType === 'flashcards' && <FlashCards />}
            </div>
        </div>
    )
}

export default App
