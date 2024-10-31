export interface Step {
    order: number;
    title: string;
}

export interface BaseTutorMessage {
    role: "assistant" | "user";
    type: "normal" | "list" | "concept" | "flashcard";
}

export interface NormalMessageType extends BaseTutorMessage {
    type: "normal";
    content: string;
}

export interface ListTutorMessage extends BaseTutorMessage {
    type: "list";
    content: {
        headerText: string;
        steps: Step[];
    };
}

export interface ConceptMessageType extends BaseTutorMessage {
    type: "concept";
    content: {
        step: Step;
        bodyText: string;
    };
}

export interface FlashcardMessageType extends BaseTutorMessage {
    type: "flashcard";
    content: {
        question: string;
        options: string[];
        correctOption: string;
    };
}