import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

// Enums and Types
enum MessageType {
	CONCEPT = "concept",
	ELI5 = "eli5",
	FLASHCARD = "flashcard",
	DETAIL = "detail",
	USER_ACTION = "user_action",
	STEPS_LIST = "steps_list",
}

interface FlashcardContent {
	question: string;
	answer: string;
}

interface BaseMessage {
	id: number;
	type: MessageType;
}

interface StepsListMessage extends BaseMessage {
	type: MessageType.STEPS_LIST;
	content: string[];
}

interface ConceptMessage extends BaseMessage {
	type: MessageType.CONCEPT;
	content: string;
	step: string;
	stepNumber: number;
}

interface UserActionMessage extends BaseMessage {
	type: MessageType.USER_ACTION;
	content: string;
}

interface ELI5Message extends BaseMessage {
	type: MessageType.ELI5;
	content: string;
}

interface FlashcardMessage extends BaseMessage {
	type: MessageType.FLASHCARD;
	content: FlashcardContent;
}

interface DetailMessage extends BaseMessage {
	type: MessageType.DETAIL;
	content: string;
}

type Message =
	| StepsListMessage
	| ConceptMessage
	| UserActionMessage
	| ELI5Message
	| FlashcardMessage
	| DetailMessage;

interface UsedActions {
	[key: number]: {
		[key: string]: boolean;
	};
}

interface ContentTypes {
	concept: { [key: string]: string };
	eli5: { [key: string]: string };
	flashcard: { [key: string]: FlashcardContent };
	detail: { [key: string]: string };
}

interface MessageProps {
	message: Message;
}

interface Step {
	order: number;
	title: string;
}

const TutorChat: React.FC = () => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [steps, setSteps] = useState<Step[]>([]);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [sessionStarted, setSessionStarted] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [usedActions, setUsedActions] = useState<{
		[key: number]: { [key: string]: boolean };
	}>({});

	const scrollToBottom = (): void => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);


	// Fetch initial steps
	useEffect(() => {
		const fetchInitialSteps = async () => {
			setIsLoading(true);
			try {
				const stepsData: Step[] = [
					{ order: 1, title: "Understanding Variables" },
					{ order: 2, title: "Control Flow" },
					{ order: 3, title: "Functions" },
				];

				setSteps(stepsData);
				setMessages([
					{
						type: MessageType.STEPS_LIST,
						content: stepsData,
						id: Date.now(),
					},
				]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialSteps();
	}, []);

	const fetchContent = async (
		step: string,
		type: keyof ContentTypes
	): Promise<any> => {
		const content: ContentTypes = {
			concept: {
				"Understanding basic variables":
					"Variables are containers for storing data values. Think of them as labeled boxes where you can put different types of information.",
				"Learning about data types":
					"Data types define what kind of value a variable can hold. Common types include numbers, strings (text), and booleans (true/false).",
				"Working with operators":
					"Operators are symbols that tell the computer to perform specific mathematical or logical manipulations.",
				"Creating conditional statements":
					"Conditional statements help your program make decisions based on specific conditions being true or false.",
				"Building loops":
					"Loops allow you to repeat a block of code multiple times until a condition is met.",
				"Writing functions":
					"Functions are reusable blocks of code that perform specific tasks when called.",
			},
			eli5: {
				"Understanding basic variables":
					"Imagine you have a toy box. The toy box is like a variable - you can put different toys in it and take them out later!",
				"Learning about data types":
					"Think of different types of containers: a pencil case for pencils (numbers), a book bag for books (text), and a light switch (true/false)!",
				"Working with operators":
					"It's like using math symbols in school! Plus (+) puts things together, minus (-) takes things away!",
				"Creating conditional statements":
					"It's like making decisions! If it's raining, bring an umbrella. If it's sunny, wear sunscreen!",
				"Building loops":
					"It's like doing jumping jacks - you keep doing them until you reach the number you wanted to do!",
				"Writing functions":
					"Think of it like a recipe - you write down the steps once, and then you can make the dish again and again!",
			},
			flashcard: {
				"Understanding basic variables": {
					question: "What is a variable?",
					answer:
						"A container for storing data values that can be changed throughout the program.",
				},
				"Learning about data types": {
					question: "Name three common data types",
					answer: "Numbers, Strings (text), and Booleans (true/false)",
				},
				"Working with operators": {
					question: "What are operators used for?",
					answer:
						"To perform mathematical or logical operations on variables and values",
				},
				"Creating conditional statements": {
					question: "What is a conditional statement?",
					answer:
						"A programming structure that executes different code based on whether a condition is true or false",
				},
				"Building loops": {
					question: "What is a loop used for?",
					answer:
						"To repeat a block of code multiple times until a condition is met",
				},
				"Writing functions": {
					question: "What is a function?",
					answer:
						"A reusable block of code that performs a specific task when called",
				},
			},
			detail: {
				"Understanding basic variables":
					"Variables in programming are fundamental storage units that can hold different types of data. They must be declared with a name that follows certain rules (no spaces, can't start with numbers, etc).",
				"Learning about data types":
					"Programming languages use data types to determine how the data should be stored in memory and what operations can be performed on it.",
				"Working with operators":
					"Operators in programming come in several categories: arithmetic operators (+, -, *, /, %), comparison operators (>, <, ==, !=), logical operators (&&, ||, !), and assignment operators (=, +=, -=).",
				"Creating conditional statements":
					"Conditional statements form the basis of decision-making in programming. They can be simple if/else statements or complex switch cases.",
				"Building loops":
					"Loops are essential for efficient programming. Common types include for loops, while loops, and do-while loops.",
				"Writing functions":
					"Functions are the building blocks of modular programming. They can accept parameters, perform operations, and return results.",
			},
		};

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(content[type][step]);
			}, 500);
		});
	};

	const handleStart = async (): Promise<void> => {
		setSessionStarted(true);

		setMessages((prev) => [
			...prev,
			{
				type: MessageType.USER_ACTION,
				content: "Let's start learning!",
				id: Date.now(),
			},
		]);

		const conceptContent = await fetchContent(steps[0], "concept");
		setMessages((prev) => [
			...prev,
			{
				type: MessageType.CONCEPT,
				content: conceptContent,
				step: steps[0],
				stepNumber: 1,
				id: Date.now(),
			},
		]);
	};

	const handleActionClick = async (
		action: string,
		step: string
	): Promise<void> => {
		setMessages((prev) => [
			...prev,
			{
				type: MessageType.USER_ACTION,
				content:
					action === "eli5"
						? "Please explain this like I'm five"
						: action === "flashcard"
						? "Show me a flashcard"
						: "I'd like more details",
				id: Date.now(),
			},
		]);

		setUsedActions((prev) => ({
			...prev,
			[currentStep]: {
				...prev[currentStep],
				[action]: true,
			},
		}));

		const content = await fetchContent(
			step,
			action === "moreDetail" ? "detail" : (action as keyof ContentTypes)
		);
		setMessages((prev) => [
			...prev,
			{
				type:
					action === "eli5"
						? MessageType.ELI5
						: action === "flashcard"
						? MessageType.FLASHCARD
						: MessageType.DETAIL,
				content,
				id: Date.now(),
			},
		]);
	};

	const handleNextStep = async (): Promise<void> => {
		const nextStep = currentStep + 1;
		setCurrentStep(nextStep);

		setMessages((prev) => [
			...prev,
			{
				type: MessageType.USER_ACTION,
				content: "Next step, please!",
				id: Date.now(),
			},
		]);

		const conceptContent = await fetchContent(steps[nextStep], "concept");
		setMessages((prev) => [
			...prev,
			{
				type: MessageType.CONCEPT,
				content: conceptContent,
				step: steps[nextStep],
				stepNumber: nextStep + 1,
				id: Date.now(),
			},
		]);
	};

	const getAvailableActions = (stepIndex: number): string[] => {
		const stepActions = usedActions[stepIndex] || {};
		const actions: string[] = [];

		if (!stepActions.eli5) actions.push("eli5");
		if (!stepActions.flashcard) actions.push("flashcard");
		if (!stepActions.moreDetail) actions.push("moreDetail");

		return actions;
	};

	const Message: React.FC<MessageProps> = ({ message }) => {
		switch (message.type) {
			case MessageType.STEPS_LIST:
				return (
					<div className="bg-white p-4 rounded-lg shadow-sm mb-4">
						<h3 className="font-bold mb-2">Here's what we'll learn:</h3>
						<ul className="list-decimal pl-5">
							{message.content.map((step, index) => (
								<li key={index} className="mb-1">
									{step}
								</li>
							))}
						</ul>
						{!sessionStarted && (
							<button
								onClick={handleStart}
								className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								Start Learning
							</button>
						)}
					</div>
				);

			case MessageType.CONCEPT:
				return (
					<div className="bg-white p-4 rounded-lg shadow-sm mb-4">
						<div className="font-bold mb-2">
							Step {message.stepNumber}: {message.step}
						</div>
						<div className="mb-4">{message.content}</div>
						<div className="flex flex-wrap items-center gap-2">
							{getAvailableActions(currentStep).map((action) => (
								<button
									key={action}
									onClick={() => handleActionClick(action, message.step)}
									className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
								>
									{action === "eli5"
										? "Explain Like I'm Five"
										: action === "flashcard"
										? "Generate Flashcard"
										: "More Detail"}
								</button>
							))}
						</div>
					</div>
				);

			case MessageType.USER_ACTION:
				return (
					<div className="flex justify-end mb-4">
						<div className="bg-blue-100 p-3 rounded-lg max-w-[80%] flex items-center gap-2">
							<span>{message.content}</span>
							<User size={16} />
						</div>
					</div>
				);

			case MessageType.ELI5:
				return (
					<div className="bg-green-50 p-4 rounded-lg shadow-sm mb-4">
						<div className="font-bold mb-2">Simple Explanation:</div>
						<div>{message.content}</div>
					</div>
				);

			case MessageType.FLASHCARD:
				return (
					<div className="bg-yellow-50 p-4 rounded-lg shadow-sm mb-4">
						<div className="font-bold mb-2">Flashcard:</div>
						<div className="font-medium">Q: {message.content.question}</div>
						<div className="mt-2">A: {message.content.answer}</div>
					</div>
				);

			case MessageType.DETAIL:
				return (
					<div className="bg-purple-50 p-4 rounded-lg shadow-sm mb-4">
						<div className="font-bold mb-2">Detailed Explanation:</div>
						<div>{message.content}</div>
					</div>
				);

			default:
				return null;
		}
	};

	if (isLoading) {
		return <div className="p-4">Loading...</div>;
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 max-w-2xl mx-auto p-4 pb-20">
				<div className="space-y-4">
					{messages.map((message) => (
						<Message key={message.id} message={message} />
					))}
				</div>
				<div ref={messagesEndRef} />
			</div>

			{sessionStarted && currentStep < steps.length - 1 && (
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center">
					<button
						onClick={handleNextStep}
						className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 shadow-md"
					>
						Next Step
					</button>
				</div>
			)}
		</div>
	);
};

export default TutorChat;
