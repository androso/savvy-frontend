import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { axios } from "./utils";
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { ListContent } from "@/components/tutor/ListMessage";
import { SessionUpdateRequest, Step } from "@/components/tutor/types";
import { ConceptContent } from "@/components/tutor/ConceptMessage";
import { get } from "http";

// Types for API responses
interface ThreadResponse {
	data: Thread;
}

interface MessageResponse {
	data: ThreadMessage;
}

type ThreadMessage = {
	type: "normal" | "list" | "concept" | "eli5" | "flashcard" | "detail";
	role: "user" | "assistant";
	content: string | ListContent | ConceptContent;
};

type Thread = {
	id: string;
	object: string;
	created_at: string | Date;
	metadata: Record<string, any>;
	messages: ThreadMessage[];
	tool_resources: Array<any>;
};

// Request types for different message types
// interface BaseMessageRequest {
// 	messageType: string;
// 	stepTitle?: string;
// 	stepNumber?: number;
// 	concept?: string;
// }

// interface StepsListRequest extends BaseMessageRequest {
// 	messageType: "list";
// 	// content: string;
// 	topic: string;
// }

// interface ConceptRequest extends BaseMessageRequest {
// 	messageType: "concept";
// 	stepTitle: string;
// 	stepNumber: number;
// }

// interface Eli5Request extends BaseMessageRequest {
// 	messageType: "eli5";
// 	stepTitle: string;
// 	stepNumber: number;
// 	concept: string;
// }

// interface DetailRequest extends BaseMessageRequest {
// 	messageType: "detail";
// 	stepTitle: string;
// 	stepNumber: number;
// 	concept: string;
// }

type MessageRequest =
	| { messageType: "list"; topic: string }
	| {
			messageType: "concept";
			stepTitle: string;
			stepNumber: number;
			topic: string;
	  }
	| {
			messageType: "eli5";
			stepTitle: string;
			stepNumber: number;
			concept: string;
	  }
	| {
			messageType: "detail";
			stepTitle: string;
			stepNumber: number;
			concept: string;
	  }
	| {
			messageType: "flashcard";
			stepTitle: string;
			stepNumber: number;
			concept: string;
	  };

type ThreadMessageRequest = MessageRequest & { threadId: string };

type ThreadMetadata = {
	sessionStarted: string;
	currentStep: string;
	sessionSteps: string;
	stepActions: string;
};
const parseThreadMetadata = (metadata: ThreadMetadata) => {
	return {
		sessionStarted: metadata.sessionStarted === "true",
		currentStep:
			metadata.currentStep === "null" ? null : JSON.parse(metadata.currentStep),
		sessionSteps: JSON.parse(metadata.sessionSteps),
		stepActions: JSON.parse(metadata.stepActions),
	};
};
// API functions
const api = {
	createThread: async (courseName: string) => {
		const response = await axios.post<ThreadResponse>(
			"/api/assistants/threads",
			{
				course_name: courseName,
			}
		);
		return response.data.data;
	},

	fetchThread: async (threadId: string, courseName?: string | null) => {
		if (!threadId) return null;
		const params = new URLSearchParams();
		if (courseName) {
			params.set("course_name", courseName);
		}
		const response = await axios.get<ThreadResponse>(
			`/api/assistants/threads/${threadId}?${params.toString()}`
		);
		const thread = response.data.data;
		if (thread.metadata) {
			thread.metadata = parseThreadMetadata(thread.metadata as ThreadMetadata);
		}
		return thread;
	},

	postMessage: async (threadId: string, request: MessageRequest) => {
		const response = await axios.post<MessageResponse>(
			`/api/assistants/threads/${threadId}/messages`,
			request
		);

		return response.data.data;
	},

	updateSession: async (request: SessionUpdateRequest) => {
		const { threadId, ...data } = request;
		const response = await axios.patch<ThreadResponse>(
			`/api/assistants/threads/${threadId}/session`,
			data
		);
		return response.data.data;
	},
};

export function useThread() {
	const navigate = useNavigate();
	const { threadId } = useParams();
	const queryClient = useQueryClient();
	const operationInProgress = useRef(false);
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const courseName =
		location.state?.course?.course_name ?? searchParams.get("course_name");

	// Query to fetch existing thread
	const { data: thread, isLoading: isLoadingExisting } = useQuery({
		queryKey: ["thread", threadId],
		queryFn: () => api.fetchThread(threadId!, courseName),
		enabled: !!threadId,
		staleTime: Infinity,
	});

	// Mutation to create new thread
	const createThreadMutation = useMutation({
		mutationFn: () => api.createThread(courseName ?? ""),
		onSuccess: (newThread) => {
			if (newThread?.id) {
				if (newThread?.metadata) {
					newThread.metadata = parseThreadMetadata(
						newThread.metadata as ThreadMetadata
					);
				}
				queryClient.setQueryData(["thread", newThread.id], newThread);

				const queryString = courseName ? `?course_name=${courseName}` : "";
				navigate(`/tutor/${newThread.id}${queryString}`, {
					replace: true,
					state: { course: location.state?.course },
				});
			}
		},
	});

	const updateSessionMutation = useMutation({
		mutationFn: async (request: SessionUpdateRequest) => {
			await api.updateSession(request);
			return api.fetchThread(request.threadId) as any;
		},
		onSuccess: (thread, variables) => {
			queryClient.setQueryData<Thread>(["thread", variables.threadId], thread);
		},
	});

	// Generic mutation for posting messages
	const postMessageMutation = useMutation({
		mutationFn: (request: ThreadMessageRequest) => {
			const { threadId, ...messageRequest } = request;
			return api.postMessage(threadId, messageRequest);
		},
		onSuccess: (message, variables) => {
			queryClient.setQueryData<Thread>(
				["thread", variables.threadId],
				(oldThread) => {
					if (!oldThread) return oldThread;
					return {
						...oldThread,
						messages: [...oldThread.messages, message],
					};
				}
			);
		},
	});

	// Helper function to add user message to thread
	const addUserMessage = (threadId: string, content: string) => {
		queryClient.setQueryData<Thread>(["thread", threadId], (oldThread) => {
			if (!oldThread) return oldThread;
			return {
				...oldThread,
				messages: [
					...oldThread.messages,
					{ role: "user", type: "normal", content },
				],
			};
		});
	};

	// Message-specific mutation handlers
	const getStepsList = async (topic: string) => {
		if (!thread?.id) return;

		addUserMessage(thread.id, topic);

		return postMessageMutation.mutateAsync({
			threadId: thread.id,
			messageType: "list",
			topic: topic,
		});
	};

	const getStepExplanation = async (step: Step, topic: string) => {
		if (!thread?.id) return;

		return postMessageMutation.mutateAsync({
			threadId: thread.id,
			messageType: "concept",
			stepTitle: step.title,
			stepNumber: step.order,
			topic,
		});
	};

	const getFlashcard = async (step: Step, concept: string) => {
		if (!thread?.id) return;

		return postMessageMutation.mutateAsync({
			threadId: thread.id,
			messageType: "flashcard",
			stepTitle: step.title,
			stepNumber: step.order,
			concept,
		});
	};

	const getEli5 = async (step: Step, concept: string) => {
		if (!thread?.id) return;

		return postMessageMutation.mutateAsync({
			threadId: thread.id,
			messageType: "eli5",
			stepTitle: step.title,
			stepNumber: step.order,
			concept,
		});
	};

	const getDetailedExplanation = async (step: Step, concept: string) => {
		if (!thread?.id) return;

		return postMessageMutation.mutateAsync({
			threadId: thread.id,
			messageType: "detail",
			stepTitle: step.title,
			stepNumber: step.order,
			concept,
		});
	};

	// Create thread effect
	useEffect(() => {
		const createNewThread = async () => {
			if (!threadId && !operationInProgress.current && !thread) {
				operationInProgress.current = true;
				try {
					await createThreadMutation.mutateAsync();
				} catch (error) {
					console.error("Failed to create thread:", error);
				} finally {
					operationInProgress.current = false;
				}
			}
		};

		createNewThread();

		return () => {
			operationInProgress.current = false;
		};
	}, [threadId, thread]);

	return {
		thread,
		getStepExplanation,
		getEli5,
		getDetailedExplanation,
		getStepsList,
		isLoading: (isLoadingExisting || createThreadMutation.isPending) && !thread,
		error: createThreadMutation.error
			? {
					message:
						(createThreadMutation.error as any).response?.data?.message ||
						"Failed to create thread",
					status: (createThreadMutation.error as any).response?.status,
			  }
			: null,
		isMessageLoading: postMessageMutation.isPending,
		messageError: postMessageMutation.error,
		updateSession: updateSessionMutation.mutateAsync,
		getFlashcard,
	};
}
