import {useState, useEffect} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
export default function FlashCard({ card }: { card: [string, string]}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const handleShowAnswer = () => {
        setShowAnswer((prev) => !prev);
    }
    useEffect(() => {
        setShowAnswer(false);
    }, [card]);
    const xx = `* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |`
    return (
        <div>
            {
                showAnswer ? (
                    <div>
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {card[1]}
                        </Markdown>
                        <div>
                            <button onClick={handleShowAnswer}>Flip back</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Markdown>
                            {card[0]}
                        </Markdown>
                        <div>
                            <button onClick={handleShowAnswer}>Flip</button>
                        </div>
                        {/* <Markdown remarkPlugins={[remarkGfm]}>
                            {xx}
                        </Markdown> */}
                    </div>
                )
            }
        </div>
    )
}