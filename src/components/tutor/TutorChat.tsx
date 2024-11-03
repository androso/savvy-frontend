import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { PaperclipIcon, ArrowUpIcon } from "lucide-react";
import { useSuggestedTopics } from "@/lib/useSuggestedTopics";
import { Course } from "@/types/types";
import {
	ConceptMessageType,
	FlashcardMessageType,
	ListTutorMessage,
	NormalMessageType,
} from "./types";
import { useThread } from "../../lib/useThread";
import { axios } from "@/lib/utils";
import FlashcardMessage from "./FlashcardMessage";
import ListMessage from "./ListMessage";
import NormalMessage from "./NormalMessage";
import LoadingSpinner from "../LoadingSpinner";
import ConceptMessage from "./ConceptMessage";

const MessageComponent = {
	normal: NormalMessage,
	list: ListMessage,
	// concept: ConceptMessage,
	// flashcard: FlashcardMessage,
} as const;

// TODO: If i reload, i would like to see the history of my thread.
// right now this is getting saved, but the backend isn't returning the right structure

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

	const [input, setInput] = useState("");
	const { suggestedTopics } = useSuggestedTopics(course?.course_id);
	const [showSuggestedTopics, setShowSuggestedTopics] = useState(
		course?.course_id ? true : false
	);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [thread?.messages]);

	useEffect(() => {
		if (!thread?.messages?.[1]) {
			setShowSuggestedTopics(true);
		} else {
			setShowSuggestedTopics(false);
		}
	}, [thread]);

	const handleSendMessage = async () => {
		// if (!input.trim() || !thread) return;
		// const isFirstMessage =
		// 	messages.filter((m) => m.role === "user").length === 0;
		// const currentInput = input;
		// // Add user message
		// setMessages((prev) => [
		// 	...prev,
		// 	{
		// 		role: "user",
		// 		type: "normal",
		// 		content: currentInput,
		// 	},
		// ]);
		// setInput("");
		// try {
		// 	// Show loading state
		// 	setMessages((prev) => [
		// 		...prev,
		// 		{
		// 			role: "assistant",
		// 			type: "normal",
		// 			content: "Processing your request...",
		// 		},
		// 	]);
		// 	if (isFirstMessage) {
		// 		const response = await axios.post(
		// 			`/api/assistant/threads/${thread.id}/messages`,
		// 			{
		// 				content: currentInput,
		// 				messageType: "list",
		// 			}
		// 		);
		// 		// Remove loading message and add response
		// 		setMessages((prev) => [
		// 			...prev.filter((m) => m.content !== "Processing your request..."),
		// 			response.data,
		// 		]);
		// 	}
		// } catch (err) {
		// 	console.error("Error processing message:", err);
		// 	setMessages((prev) => [
		// 		...prev.filter((m) => m.content !== "Processing your request..."),
		// 		{
		// 			role: "assistant",
		// 			type: "normal",
		// 			content: "Sorry, there was an error processing your request.",
		// 		},
		// 	]);
		// }
	};

	const handleTopicClick = async (topic: string) => {
		topic;
		// if (!thread) return;
		// const isFirstMessage =
		// 	messages.filter((m) => m.role === "user").length === 0;
		// setMessages((prev) => [
		// 	...prev,
		// 	{
		// 		role: "user",
		// 		type: "normal",
		// 		content: topic,
		// 	},
		// ]);
		// try {
		// 	if (isFirstMessage) {
		// 		setMessages((prev) => [
		// 			...prev,
		// 			{
		// 				role: "assistant",
		// 				type: "normal",
		// 				content: "Processing your request...",
		// 			},
		// 		]);
		// 		const response = await axios.post(
		// 			`/api/assistants/threads/${thread.id}/messages`,
		// 			{
		// 				content: topic,
		// 				messageType: "list",
		// 			}
		// 		);
		// 		setMessages((prev) => [
		// 			...prev.filter((m) => m.content !== "Processing your request..."),
		// 			response.data,
		// 		]);
		// 	}
		// } catch (err) {
		// 	console.error("Error processing topic:", err);
		// }
		// setShowSuggestedTopics(false);
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
			<div
				ref={chatContainerRef}
				className="flex-1 overflow-auto p-6 h-full w-full overflow-y-scroll"
			>
				{/* CHAT DISPLAY WINDOW */}
				<div className="max-w-2xl mx-auto pb-10">
					{thread?.messages?.[0] && (
						<NormalMessage
							content={thread?.messages[0]?.content as any}
							role="assistant"
						/>
					)}

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

					{/* USER / TUTOR MESSAGES */}
					{thread?.messages &&
						thread.messages.length > 0 &&
						thread.messages.slice(1).map((message, index) => {
							const Component =
								MessageComponent[message.type as keyof typeof MessageComponent];

							if (!Component) {
								console.warn(`Unknown message type: ${message.type}`);
								return null;
							}

							return (
								<Component
									key={index}
									role={message.role}
									content={message.content as any}
								/>
							);
						})}
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
