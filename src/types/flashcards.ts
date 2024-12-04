
export type FlashCardApiResponse = {
    [key: string]: [string, string][];
};

export interface FlashCardState {
    flashStarted: boolean;
    category: { id: string; name: string } | null;
    currentCards: [string, string][];
    numberOfCards: number;
    currentQuestionIndex: number;
    flashCards: {
        [key: string]: FlashCardApiResponse
    };
    flashCardSubjects: {
        id: string;
        name: string;
    }[]
    subject: {
        id: string;
        name: string;
    } | null;
    categories: string[];
    flashCardStarted: boolean;
}