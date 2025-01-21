export interface  QuizQuestion  {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    explanation: string;
    difficulty_level?: string;
};
// export interface QuestionsApiResponse {
//     results: QuizQuestion[]
// }
// Fix by defining it as an array type:
export type QuestionsApiResponse = QuizQuestion[];

// Or using an interface:
// interface QuestionsApiResponse extends Array<Question> {}

export interface Category {
    id: string
    name: string
}
export interface CategoriesResponse {
    trivia_categories: Category[]
}
