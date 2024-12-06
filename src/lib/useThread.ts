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
import { Step } from "@/components/tutor/types";
import { ConceptContent } from "@/components/tutor/ConceptMessage";

type ThreadMessage = {
	type: "normal" | "list" | "concept" | "eli5" | "flashcard" | "detail";
	role: "user" | "assistant";
	content: string | ListContent;
	stepNumber?: number;
};

type Thread = {
	id: string;
	object: string;
	created_at: string | Date;
	metadata: Record<string, any>;
	messages: ThreadMessage[];
	tool_resources: Array<any>;
};

interface StepsListResponse {
	type: "list";
	role: "assistant";
	content: ListContent;
}

interface ConceptMessageResponse {
	type: "concept";
	role: "assistant";
	content: ConceptContent;
}

interface Eli5MessageResponse {
	type: "eli5";
	role: "assistant";
	content: string;
}
interface DetailedExplanation {
	type: "detail";
	role: "assistant";
	content: string;
}

const createThread = async (courseName: string) => {
	const response = await axios.post("/api/assistants/threads", {
		course_name: courseName,
	});
	return response.data.data as Thread;
};

const fetchThread = async (threadId: string, courseName: string) => {
	if (!threadId) return null;
	const params = new URLSearchParams();
	if (courseName) {
		params.set("course_name", courseName);
	}

	const response = await axios.get(
		`/api/assistants/threads/${threadId}?${params.toString()}`
	);

	return response.data.data as Thread;
};

export function useThread() {
	const navigate = useNavigate();
	const { threadId } = useParams();
	const queryClient = useQueryClient();
	const operationInProgress = useRef(false);
	const location = useLocation();
	const [searchParams] = useSearchParams();

	// Query to get an existing thread
	const { data: existingThread, isLoading: isLoadingExisting } = useQuery({
		queryKey: ["thread", threadId],
		queryFn: () =>
			fetchThread(
				threadId!,
				location.state?.course?.course_name ?? searchParams.get("course_name")
			),
		enabled: !!threadId,
		staleTime: Infinity, // Prevent unnecessary refetches
	});

	// Mutation to create a new thread
	const mutation = useMutation({
		mutationFn: () => createThread(location.state?.course?.course_name),
		onMutate: () => {
			operationInProgress.current = true;
		},
		onSuccess: (thread) => {
			if (thread?.id) {
				const course = location.state?.course;
				queryClient.setQueryData(["thread", thread.id], thread);

				const searchParams = new URLSearchParams();
				if (course?.course_name) {
					searchParams.set("course_name", course.course_name);
				}
				const queryString = searchParams.toString()
					? `?${searchParams.toString()}`
					: "";

				navigate(`/tutor/${thread.id}${queryString}`, {
					replace: true,
					state: {
						course: location.state?.course,
					},
				});
			}
		},
		onSettled: () => {
			operationInProgress.current = false;
		},
	});

	useEffect(() => {
		const createNewThread = async () => {
			if (!threadId && !operationInProgress.current && !existingThread) {
				try {
					operationInProgress.current = true;
					await mutation.mutateAsync();
				} catch (error) {
					console.error("Failed to create thread:", error);
				}
			}
		};

		// IIFE to handle async operation
		(async () => {
			await createNewThread();
		})();

		return () => {
			operationInProgress.current = false;
		};
	}, [threadId, existingThread]);

	// Single source of truth for thread data
	const thread = existingThread ?? mutation.data;

	// todo: write a function that returns flashcard based on the step
	// modify the messages based on the returned value
	const getStepExplanation = async (step: Step): Promise<void> => {
		try {
			const response = await axios.post<{ data: ConceptMessageResponse }>(
				`/api/assistants/threads/${thread?.id}/messages`,
				{
					stepTitle: step.title,
					messageType: "concept",
					stepNumber: step.order,
				}
			);

			// Update messages in thread
			if (thread) {
				const conceptMessage: ConceptMessageResponse = response.data.data;
				queryClient.setQueryData(["thread", thread.id], {
					...thread,
					messages: [...thread.messages, conceptMessage],
				});
			}
		} catch (error) {
			// todo: handle error state
			console.error("Failed to get step explanation:", error);
		}
	};

	const getEli5 = async (step: Step, concept: string) => {
		try {
			const response = await axios.post<{ data: Eli5MessageResponse }>(
				`/api/assistants/threads/${thread?.id}/messages`,
				{
					stepTitle: step.title,
					messageType: "eli5",
					stepNumber: step.order,
					concept,
				}
			);

			// Update messages in thread
			if (thread) {
				const eli5Message: Eli5MessageResponse = response.data.data;
				queryClient.setQueryData(["thread", thread.id], {
					...thread,
					messages: [...thread.messages, eli5Message],
				});
			}
		} catch (error) {
			//todo: implement error handling
			console.error("Failed to get ELI5 explanation:", error);
		}
	};

	const getDetailedExplanation = async (step: Step, concept: string) => {
		try {
			const response = await axios.post<{ data: DetailedExplanation }>(
				`/api/assistants/threads/${thread?.id}/messages`,
				{
					stepTitle: step.title,
					messageType: "detail",
					stepNumber: step.order,
					concept,
				}
			);

			// Update messages in thread
			if (thread) {
				const detailMessage: DetailedExplanation = response.data.data;

				queryClient.setQueryData(["thread", thread.id], {
					...thread,
					messages: [...thread.messages, detailMessage],
				});
			}
		} catch (error) {
			//todo: implement error handling
			console.error("Failed to get detailed explanation:", error);
		}
	};

	const getStepsList = async (topic: string) => {
		if (!thread) return;

		try {
			const userMessage: ThreadMessage = {
				role: "user",
				type: "normal",
				content: topic,
			};
			queryClient.setQueryData(["thread", thread.id], {
				...thread,
				messages: [...thread.messages, userMessage],
			});

			const response = await axios.post<{ data: StepsListResponse }>(
				`/api/assistants/threads/${thread.id}/messages`,
				{
					content: topic,
					messageType: "list",
				}
			);

			const stepsMessage: StepsListResponse = response.data.data;

			queryClient.setQueryData(["thread", thread.id], {
				...thread,
				messages: [...thread.messages, userMessage, stepsMessage],
			});
		} catch (e) {
			//todo: implement error handling
			console.error("Failed to get steps list:", e);
		}
	};

	return {
		thread,
		getStepExplanation,
		getEli5,
		getDetailedExplanation,
		getStepsList,
		isLoading: (isLoadingExisting || mutation.isPending) && !thread,
		error: mutation.error
			? {
					message:
						(mutation.error as any).response?.data?.message ||
						"Failed to create thread",
					status: (mutation.error as any).response?.status,
			  }
			: null,
	};
}
