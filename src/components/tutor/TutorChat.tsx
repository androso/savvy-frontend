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
	Step,
} from "./types";
import { useThread } from "@/lib/useThread";
import FlashcardMessage, { FlashcardContent } from "./FlashcardMessage";
import ListMessage from "./ListMessage";
import NormalMessage from "./NormalMessage";
import LoadingSpinner from "../LoadingSpinner";
import ConceptMessage, { ConceptContent } from "./ConceptMessage";

const MessageComponent = {
	normal: NormalMessage,
	list: ListMessage,
	concept: ConceptMessage,
	eli5: ConceptMessage,
	detail: ConceptMessage,
	flashcard: FlashcardMessage,
} as const;

interface StepActions {
	eli5: boolean;
	flashcard: boolean;
	moreDetail: boolean;
}

// TODO: apparently we can't store a lot of info in metadata at openai
// TODO: it's returning an error saying that the steps are too long.
export default function TutorChat() {
	const location = useLocation();
	const { threadId } = useParams();
	const navigate = useNavigate();
	const chatContainerRef = useRef<HTMLDivElement>(null);

	const course: Course = location.state?.course;
	const { suggestedTopics } = useSuggestedTopics(course?.course_id);

	// Thread state and actions
	const {
		thread,
		getStepsList,
		getStepExplanation,
		getEli5,
		getDetailedExplanation,
		isLoading,
		isMessageLoading,
		error,
		updateSession,
		messageError,
		getFlashcard,
	} = useThread();

	// Local state
	const [input, setInput] = useState("");
	const [showSuggestedTopics, setShowSuggestedTopics] = useState(
		!!course?.course_id
	);
	const [sessionSteps, setSessionSteps] = useState<Step[]>([]);
	const [currentStep, setCurrentStep] = useState<Step | null>(null);
	const [currentConcept, setCurrentConcept] = useState<string | null>(null);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [stepActions, setStepActions] = useState<StepActions>({
		eli5: false,
		flashcard: false,
		moreDetail: false,
	});

	// sync initial state from metadata
	useEffect(() => {
		if (thread?.metadata) {
			setSessionStarted(thread.metadata.sessionStarted || false);
			setCurrentStep(thread.metadata.currentStep || null);
			setSessionSteps(thread.metadata.sessionSteps || []);
			setStepActions(
				thread.metadata.stepActions || {
					eli5: false,
					flashcard: false,
					moreDetail: false,
				}
			);
		}
	}, [thread?.metadata]);

	// Scroll to bottom effect
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [thread?.messages, isMessageLoading]);

	// Show suggested topics if no messages
	useEffect(() => {
		setShowSuggestedTopics(!thread?.messages?.[1]);
	}, [thread?.messages]);

	// Redirect if no course
	useEffect(() => {
		if (!course && !threadId) {
			navigate("/");
		}
	}, [course, threadId, navigate]);

	// Session management functions
	const startSession = async () => {
		if (!sessionSteps.length || sessionStarted || !thread?.id) return;

		setSessionStarted(true);
		setCurrentStep(sessionSteps[0]);

		try {
			let explanation = await getStepExplanation(
				sessionSteps[0],
				thread?.messages?.[1]?.content as string
			);
			const newStepActions = {
				eli5: false,
				flashcard: false,
				moreDetail: false,
			};

			if (explanation?.content && typeof explanation?.content !== "string") {
				let concept = explanation.content as ConceptContent;
				setCurrentConcept(concept.explanation);
			}

			setStepActions(newStepActions);
			await updateSession({
				threadId: thread.id,
				sessionStarted: true,
				currentStep: sessionSteps[0],
				sessionSteps,
				stepActions: newStepActions,
			});
		} catch (error) {
			console.error("Failed to start session:", error);
		}
	};

	const getAvailableActions = (): string[] => {
		const actions = [];
		if (!stepActions.eli5) actions.push("eli5");
		if (!stepActions.flashcard) actions.push("flashcard");
		if (!stepActions.moreDetail) actions.push("moreDetail");
		return actions;
	};

	const handleActionClick = async (action: keyof StepActions) => {
		if (!currentStep || !thread) return;

		try {
			switch (action) {
				case "eli5":
					await getEli5(currentStep, currentConcept || currentStep.title);
					break;
				case "moreDetail":
					await getDetailedExplanation(
						currentStep,
						currentConcept || currentStep.title
					);
					break;
				case "flashcard":
					await getFlashcard(currentStep, currentConcept || currentStep.title);
					break;
			}
			const newStepActions = { ...stepActions, [action]: true };
			setStepActions(newStepActions);

			await updateSession({
				threadId: thread.id,
				sessionStarted,
				currentStep,
				sessionSteps,
				stepActions: newStepActions,
			});
		} catch (error) {
			console.error(`Failed to execute ${action}:`, error);
		}
	};

	const handleNextStep = async () => {
		if (!currentStep || !sessionSteps.length || !thread?.id) return;

		const nextStepIndex =
			sessionSteps.findIndex((step) => step.order === currentStep.order) + 1;
		if (nextStepIndex < sessionSteps.length) {
			const nextStep = sessionSteps[nextStepIndex];
			setCurrentStep(nextStep);
			const newStepActions = {
				eli5: false,
				flashcard: false,
				moreDetail: false,
			};
			setStepActions(newStepActions);

			try {
				let explanation = await getStepExplanation(
					nextStep,
					thread?.messages?.[1]?.content as string
				);
				console.log({ explanation });
				if (explanation?.content && typeof explanation?.content !== "string") {
					let concept = explanation.content as ConceptContent;
					setCurrentConcept(concept.explanation);
				}

				await updateSession({
					threadId: thread.id,
					sessionStarted,
					currentStep: nextStep,
					sessionSteps,
					stepActions: newStepActions,
				});
			} catch (error) {
				console.error("Failed to get next step explanation:", error);
			}
		}
	};

	const handleTopicClick = async (topic: string) => {
		try {
			const message = await getStepsList(topic);
			if (
				message &&
				typeof message.content !== "string" &&
				"steps" in message.content
			) {
				setSessionSteps(message.content.steps);
				setShowSuggestedTopics(false);
				if (thread?.id) {
					await updateSession({
						threadId: thread.id,
						sessionStarted,
						currentStep,
						sessionSteps: message.content.steps,
						stepActions,
					});
				}
			}
		} catch (error) {
			console.error("Failed to get steps list:", error);
		}
	};

	const saveFlashcard = async (flashcard: FlashcardContent) => {
		if (!thread?.id) return;

		try {
			// TODO:
			// call the api to save the flashcard
			// disable the "save" button in the current flashcard
			// show success mesage in case everything goes right
		} catch (error) {
			console.error("Failed to save flashcard:", error);
		}
	}

	const handleSendMessage = async () => {
		if (!input.trim() || !thread) return;

		const topic = input.trim();
		setInput("");
		await handleTopicClick(topic);
	};

	if (isLoading) return <LoadingSpinner />;

	if (error || !thread) {
		return (
			<div className="flex items-center justify-center h-full">
				<Card className="max-w-md p-6">
					<CardTitle className="text-red-600 mb-4">Error</CardTitle>
					<p className="text-gray-700">
						{error?.message ||
							"Sorry, we couldn't start your tutoring session. Please try again later."}
					</p>
					<Button className="mt-4" onClick={() => navigate("/")}>
						Back to Home
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-gray-100 items-center">
			<div
				ref={chatContainerRef}
				className="flex-1 overflow-auto p-6 h-full w-full overflow-y-scroll"
			>
				<div className="max-w-2xl mx-auto pb-10">
					{/* Welcome Message */}
					{thread.messages?.[0] && (
						<NormalMessage
							content={thread.messages[0].content as string}
							role="assistant"
						/>
					)}

					{/* Suggested Topics */}
					{showSuggestedTopics && (
						<div className="mt-6">
							<h2 className="text-lg font-semibold mb-4">Suggested topics</h2>
							<div className="flex flex-wrap gap-3">
								{suggestedTopics?.map((topic, index) => (
									<Button
										key={index}
										variant="outline"
										className="justify-start text-left h-auto py-2 px-3 flex-[0_1_auto] min-w-[40%] max-w-full border border-gray-500"
										onClick={() => handleTopicClick(topic)}
										disabled={isMessageLoading}
									>
										{topic}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Messages */}
					{thread.messages?.slice(1).map((message, index) => {
						const Component =
							MessageComponent[message.type as keyof typeof MessageComponent];
						if (!Component) return null;

						if (message.type === "eli5") {
							//@ts-ignore
							message.content.stepTitle = "Simplificación";
						} else if (message.type === "detail") {
							//@ts-ignore
							message.content.stepTitle = "Detalles";
						}

						return (
							<Component
								key={index}
								role={message.role}
								content={message.content as any}
								saveFlashcard={saveFlashcard}
							/>
						);
					})}

					{/* Session Controls */}
					{sessionSteps.length > 0 && !sessionStarted && (
						<div className="mt-4">
							<Button
								onClick={startSession}
								disabled={isMessageLoading}
								className="w-full"
							>
								Start Learning Session
							</Button>
						</div>
					)}

					{/* Step Actions */}
					{sessionStarted && currentStep && (
						<div className="mt-4 space-y-2">
							{getAvailableActions().map((action) => (
								<Button
									key={action}
									onClick={() => handleActionClick(action as keyof StepActions)}
									disabled={isMessageLoading}
									className="mr-2"
								>
									{action === "eli5"
										? "Simplificar"
										: action === "flashcard"
										? "Generar Flashcard"
										: "Expandir Detalles"}
								</Button>
							))}

							{currentStep.order < sessionSteps.length && (
								<Button
									onClick={handleNextStep}
									disabled={isMessageLoading}
									className="w-full mt-4"
								>
									Next Step
								</Button>
							)}
						</div>
					)}

					{/* Loading State */}
					{isMessageLoading && (
						<div className="mt-4 text-center">
							<LoadingSpinner />
						</div>
					)}
				</div>
			</div>

			{/* Input Box */}
			<div className="fixed bottom-[69px] bg-white p-4 shadow-md w-full max-w-2xl mx-auto">
				<div className="flex items-center">
					<Input
						placeholder="Enter a question or topic"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
						className="flex-1"
						disabled={isMessageLoading || sessionStarted}
					/>
					<Button
						onClick={handleSendMessage}
						className="ml-2"
						disabled={isMessageLoading || sessionStarted}
					>
						<ArrowUpIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
