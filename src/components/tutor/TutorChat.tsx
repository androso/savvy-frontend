import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PaperclipIcon,
	ArrowUpIcon,
	Book,
	CircleX,
	Download,
	Loader2,
} from "lucide-react";
import { useSuggestedTopics } from "@/lib/useSuggestedTopics";
import { Course } from "@/types/types";
import {
	BaseTutorMessage,
	ConceptMessageType,
	FlashcardMessageType,
	ListTutorMessage,
	NormalMessageType,
	Step,
} from "./types";
import { useThread } from "../../lib/useThread";

// ! TODO: Add different types of messages from the tutor
// ! TODO: STEP: should have the important concepts / words in bold
// ! FLASHCARD: in the header should go the question
// ! in the body should go options to "reveal", "save flaschard to library", "discard"
// ! discard a flashcard should remove the flashcard from the chat

function ListMessage({
	headerText,
	steps,
}: {
	headerText: string;
	steps: Step[];
}) {
	return (
		<Card className="mb-4 p-4 bg-white">
			<div className="flex items-center mb-2">
				<div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
				<span className="font-semibold">Gizmo</span>
			</div>
			<p className="whitespace-pre-wrap">{headerText}</p>
			<div className="space-y-2">
				{steps.map((step) => (
					<div
						key={step.order}
						className="flex items-start bg-gray-50 rounded-md p-3 mt-3"
					>
						<span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-sm font-medium text-gray-600">
							{step.order}
						</span>
						<p className="text-gray-700">{step.title}</p>
					</div>
				))}
			</div>
		</Card>
	);
}

function NormalMessage({ role, content }: { role: string; content: string }) {
	return (
		<Card
			className={`mb-4 p-4 ${
				role === "assistant" ? "bg-white" : "bg-blue-100"
			}`}
		>
			{role === "assistant" && (
				<div className="flex items-center mb-2">
					<div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
					<span className="font-semibold">Gizmo</span>
				</div>
			)}
			<p className="whitespace-pre-wrap">{content}</p>
		</Card>
	);
}

function ConceptMessage({
	stepNumber,
	title,
	content,
}: {
	stepNumber: number;
	title: string;
	content: string;
}) {
	return (
		<Card className="p-6 bg-white shadow-sm">
			<div className="flex items-start mb-4">
				<div className="flex-shrink-0 w-8 h-8 mr-3 bg-blue-100 rounded-lg flex items-center justify-center">
					<span className="text-blue-600 font-semibold text-lg">
						{stepNumber}
					</span>
				</div>
				<h2 className="text-xl font-bold flex-grow">{title}</h2>
			</div>
			<hr className="border-t border-gray-200 mb-4" />
			<p className="text-gray-700 leading-relaxed">{content}</p>
		</Card>
	);
}
function FlashcardMessage({
	question,
	options,
	correctOption,
}: {
	question: string;
	options: string[];
	correctOption: string;
}) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isRevealed, setIsRevealed] = useState<boolean>(false);

	const handleOptionClick = (option: string) => {
		if (option === correctOption) {
			setIsRevealed(true);
		} else {
			setIsRevealed(false);
			setSelectedOptions([...selectedOptions, option]);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
			<div className="p-6">
				<CardHeader className="pb-4">
					<CardTitle className="text-center text-xl font-bold text-gray-800 px-4">
						{question}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{options.map((option, index) => (
						<Button
							key={index}
							variant="outline"
							className={`w-full justify-center h-auto py-4 px-6 text-center text-gray-700 bg-blue-50 ${
								(isRevealed || selectedOptions.includes(option)) &&
								"pointer-events-none"
							} border-gray-200 hover:bg-blue-100 ${
								isRevealed && option === correctOption
									? "bg-green-300"
									: selectedOptions.includes(option)
									? "bg-red-300"
									: " "
							}`}
							onClick={() => handleOptionClick(option)}
							disabled={isRevealed ? option !== correctOption : false}
						>
							{option}
						</Button>
					))}
					<div className="flex justify-center space-x-4 mt-2">
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-green-300 border-gray-200"
						>
							<Download className="mr-2 h-5 w-5" /> Save
						</Button>
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-blue-100 border-gray-200"
							disabled={isRevealed}
							onClick={() => setIsRevealed(true)}
						>
							<Book className="mr-2 h-5 w-5" /> Reveal
						</Button>
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-red-400 border-gray-200"
						>
							<CircleX className="mr-2 h-5 w-5" /> Discard
						</Button>
					</div>
				</CardContent>
			</div>
		</Card>
	);
}

function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center h-full">
			<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			<span className="ml-2 text-gray-600">
				Creando tu sesión de tutoría...
			</span>
		</div>
	);
}

export default function TutorChat() {
	const location = useLocation();
	const { threadId } = useParams();
	const course: Course = location.state?.course;
	const navigate = useNavigate();
	const { thread, isLoading, error } = useThread();

	// Handle no course data
	useEffect(() => {
		if (!course && !threadId) {
			navigate("/");
		}
	}, [course, threadId]);

	const [messages, setMessages] = useState<
		(
			| BaseTutorMessage
			| ConceptMessageType
			| ListTutorMessage
			| NormalMessageType
			| FlashcardMessageType
		)[]
	>([]);
	const [input, setInput] = useState("");
	const { suggestedTopics } = useSuggestedTopics(course?.course_id);
	const [showSuggestedTopics, setShowSuggestedTopics] = useState(
		course?.course_id ? true : false
	);

	// Initialize messages when thread is loaded
	useEffect(() => {
		if (thread && course && messages.length === 0) {
			setMessages([
				{
					role: "assistant",
					type: "normal",
					content: `Hablemos sobre ${course.course_name}. ¿Qué te gustaría saber al respecto?`,
				} as NormalMessageType,
			]);
		}
	}, [thread, course]);

	const handleSendMessage = async () => {
		if (!input.trim() || !thread) return;

		// Add user message
		setMessages((prev) => [
			...prev,
			{
				role: "user",
				type: "normal",
				content: input,
			},
		]);

		setInput("");
		setShowSuggestedTopics(false);

		try {
			// Send message to thread
			// const response = await axios.post("/api/assistants/threads/messages", {
			// 	thread,
			// 	message: input,
			// });

			// Add assistant response
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					type: "normal",
					content: "I'm processing your question. Please wait for my response.",
				},
			]);
		} catch (err) {
			console.error("Error sending message:", err);
		}
	};

	const handleTopicClick = async (topic: string) => {
		if (!thread) return;

		setMessages((prev) => [
			...prev,
			{
				role: "user",
				type: "normal",
				content: topic,
			},
		]);

		setShowSuggestedTopics(false);

		// try {
		// 	await axios.post("/api/assistants/threads/messages", {
		// 		thread,
		// 		message: topic,
		// 	});

		// 	setMessages((prev) => [
		// 		...prev,
		// 		{
		// 			role: "assistant",
		// 			type: "normal",
		// 			content: `Let's discuss ${topic}. What would you like to know about it?`,
		// 		},
		// 	]);
		// } catch (err) {
		// 	console.error("Error sending topic:", err);
		// }
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error || !thread) {
		return (
			<div className="flex items-center justify-center h-full">
				<Card className="max-w-md p-6">
					<CardTitle className="text-red-600 mb-4">Error</CardTitle>
					<p className="text-gray-700">
						{error?.message ||
							"Lo sentimos, no pudimos iniciar tu sesión de tutoría. Por favor, intenta de nuevo más tarde."}
					</p>
					<Button className="mt-4" onClick={() => navigate("/")}>
						Volver al inicio
					</Button>
				</Card>
			</div>
		);
	}

	// Return the main chat interface only when we have a valid thread
	return (
		<div className="flex flex-col h-full bg-gray-100 items-center">
			<div className="flex-1 overflow-auto p-6 h-full  w-full overflow-y-scroll">
				{/* CHAT DISPLAY WINDOW */}
				<div className="max-w-2xl mx-auto pb-10">
					{/* USER / TUTOR MESSAGES */}
					{messages.map((message, index) => {
						if (message.type == "normal") {
							const normalMessage = message as NormalMessageType;
							return (
								<NormalMessage
									key={index}
									content={normalMessage.content}
									role={normalMessage.role}
								/>
							);
						} else if (message.type == "list") {
							const listMessage = message as ListTutorMessage;
							return (
								<ListMessage
									key={index}
									headerText={listMessage.content.headerText}
									steps={listMessage.content.steps}
								/>
							);
						} else if (message.type == "concept") {
							const conceptMessage = message as ConceptMessageType;
							return (
								<ConceptMessage
									content={conceptMessage.content.bodyText}
									stepNumber={conceptMessage.content.step.order}
									title={conceptMessage.content.step.title}
								/>
							);
						} else if (message.type == "flashcard") {
							const flashcardMessage = message as FlashcardMessageType;
							return (
								<FlashcardMessage
									options={flashcardMessage.content.options}
									question={flashcardMessage.content.question}
									correctOption={flashcardMessage.content.correctOption}
								/>
							);
						}
					})}

					{/* Conditionally render suggested topics */}
					{showSuggestedTopics && (
						<div className="mt-6">
							<h2 className="text-lg font-semibold mb-4">Suggested topics</h2>
							<div className="flex flex-wrap gap-3">
								{suggestedTopics &&
									suggestedTopics?.map((topic, index) => (
										<Button
											key={index}
											variant={"outline"}
											className="justify-start text-left h-auto py-2 px-3 flex-[0_1_auto] min-w-[40%] max-w-full border border-gray-500"
											onClick={() => handleTopicClick(topic)}
										>
											{topic}
										</Button>
									))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/*  USER INPUT BOX */}
			<div className="fixed bottom-[69px] bg-white  p-4 shadow-md w-full max-w-2xl mx-auto ">
				<div className="flex items-center">
					<label htmlFor="file-upload" className="mr-2">
						<Button
							variant="outline"
							size="icon"
							className="cursor-pointer"
							tabIndex={0}
							role="button"
							aria-label="Attach file"
						>
							<PaperclipIcon className="h-4 w-4" />
						</Button>
					</label>
					<Input
						id="file-upload"
						type="file"
						className="hidden"
						// onChange={(event) => handleFileUpload(event)}
						aria-label="File upload"
					/>
					<Input
						placeholder="Enter a question or topic"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
						className="flex-1"
					/>
					<Button onClick={handleSendMessage} className="ml-2">
						<ArrowUpIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
