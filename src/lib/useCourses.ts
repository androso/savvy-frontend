import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "./utils";

const fetchCourses = async () => {
	const { data } = await axios.get(`/api/courses`);
	return data.data;
};

// Create a new course

// Delete a course
const deleteCourse = async (courseId: string) => {
	const { data } = await axios.delete(`/api/courses/${courseId}`);
	return data.data;
};

export const useCourses = (userId: string) => {
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuery({
		queryKey: ["courses", userId],
		queryFn: fetchCourses,
		enabled: !!userId,
		initialData: [],
	});

	const createCourse = async ({
		courseName,
		description,
	}: {
		courseName: string;
		description: string;
	}) => {
		const { data } = await axios.post(`/api/courses`, {
			course_name: courseName,
			description: description != null ? description : "",
		});
		return data.data;
	};

	const createCourseMutation = useMutation({
		mutationFn: createCourse,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses", userId] });
		},
	});

	const deleteCourseMutation = useMutation({
		mutationFn: deleteCourse,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses", userId] });
		},
	});

	return {
		courses: data,
		isLoading,
		error,
		createCourse: createCourseMutation.mutateAsync,
		deleteCourse: deleteCourseMutation.mutateAsync,
	};
};
