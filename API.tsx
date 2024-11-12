import { shuffleArray } from "@/app/utilities";

export const fetchQuestion = async (amount: number, difficulty: Difficulty) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty.toLowerCase()}&type=multiple`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }

        const data = await response.json();

        localStorage.setItem('quizQuestions', JSON.stringify(data.results));

        return data.results.map((question: Question) => {
            return {
                ...question,
                answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
            };
        });
    } catch (error) {
        console.error("Error fetching questions: ", error);

        const cachedQuestions = localStorage.getItem('quizQuestions');
        if (cachedQuestions) {
            return JSON.parse(cachedQuestions).map((question: Question) => {
                return {
                    ...question,
                    answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
                };
            });
        }

        return [];
    }
};

export enum Difficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
}

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

export type QuestionState = Question & { answers: string[] };
