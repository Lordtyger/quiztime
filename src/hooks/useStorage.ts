import { useState, useEffect } from "react";
import type { Storage } from '../types/quiz';

// const quizData =  {
//     javascript: [
//         {id: 'array', name: "Array"},
//         {id: 'class', name: "Classes"},
//         {id: 'expressionsandoperators', name: "Expression & Operators"},
//         {id: 'map', name: "Map"},
//         {id: 'object', name: "Object"},
//         {id: 'promise', name: "Promise"},
//         {id: 'set', name: "Set"},
//         {id: 'statementsanddeclarations', name: "Statements & Declarations"},
//         {id: 'string', name: "String"},
//         {id: 'functionandmisc', name: "Function & Misc"},
//         {id: 'nextjs', name: "Next.js"},
//     ],
//     words: [
//         {id: 'words1', name: "Words One"},
//     ],
//     flexbox: [
//         {id: 'flex1', name: "Flexbox"},
//     ]
// };
export default function useStorage(key: string = 'quizData', initialValue: Storage = {}, setOrRead: 'set' | 'read') {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : {};
    });

    useEffect(() => {
        if(setOrRead) {
            // create storage object

        } else {
            //
        }
    }, [setOrRead]);
}