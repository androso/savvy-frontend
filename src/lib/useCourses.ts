import { useQuery } from "@tanstack/react-query";
import { axios } from "./utils";

const fetchCourses = async (userId: string) => {
	const { data } = await axios.get(`/api/courses`, {
		params: { user_id: userId },
	});

	return data.data;
};

export const useCourses = (userId: string) => {
	return useQuery({
		queryKey: ["courses", userId],
		queryFn: () => fetchCourses(userId),
		enabled: !!userId,
		initialData: [],
	});
};
