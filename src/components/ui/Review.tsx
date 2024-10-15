import { useUser } from "@/lib/useUser";
import NavigationBar from "./NavigationBar";

const Review = () => {
	const {isLoading } = useUser();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	

	return (
		<>
			<div>Review Page</div>
			<NavigationBar />
		</>
	);
};

export default Review;
