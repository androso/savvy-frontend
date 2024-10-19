import { useQuery } from "@tanstack/react-query";
import { axios } from "./utils";
import { useUser } from "./useUser";

interface SuggestedTopicDB {
	course_id: number;
	created_at: string;
	suggested_topic_id: number;
	topic_name: string;
}

const fetchSuggestedTopics = async (courseId: string): Promise<string[]> => {
	if (courseId) {
		const { data } = await axios.get(
			`/api/courses/${courseId}/suggested-topics`
		);

		if (data) {
			return data.topics.map((topic: SuggestedTopicDB) => topic.topic_name);
		}
	}
	return [];
};

export const useSuggestedTopics = (courseId: string) => {
	const { user } = useUser();
	const { data, isLoading, error } = useQuery({
		queryKey: ["suggestedTopics", user, courseId],
		queryFn: () => fetchSuggestedTopics(courseId),
	});

	return {
		suggestedTopics: data,
		isLoading,
		error,
	};
};
