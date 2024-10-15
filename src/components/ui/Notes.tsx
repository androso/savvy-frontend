import { useUser } from "@/lib/useUser";
import NavigationBar from "./NavigationBar";

const Notes = () => {
	const {isLoading} = useUser()

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div>Notes Page</div>
			<NavigationBar />
		</>
	);
};

export default Notes;
