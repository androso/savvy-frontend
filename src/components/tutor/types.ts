export interface Step {
    order: number;
    title: string;
}

export interface BaseTutorMessage {
    role: "assistant" | "user";
    type: "normal" | "list" | "concept" | "flashcard";
    content: any;
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

export interface SessionUpdateRequest {
  threadId: string;
  sessionStarted: boolean;
  currentStep: Step | null;
  sessionSteps: Step[];
  stepActions: {
    eli5: boolean;
    flashcard: boolean;
    moreDetail: boolean;
  };
}