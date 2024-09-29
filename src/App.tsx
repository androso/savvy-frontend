import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useUser } from "./lib/useUser";
import "./App.css";
import AITutorChat from "./components/ui/Chat";
import { useCourses } from "./lib/useCourses";

export interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string;
	user_id: string;
}
interface Course {
	course_id: string;
	course_name: string;
	user_id: string;
}

function App() {
	const { user, isLoading, saveUser, logout } = useUser();
	const { data: courses } = useCourses(user?.user_id || "");

	const onSuccess = (response: CredentialResponse) => {
		if (response.credential) {
			const decoded: DecodedUser = jwtDecode(response.credential);
			console.log("Login Success: currentUser:", decoded);
			saveUser(decoded);
		}
	};

	const onFailure = () => {
		console.log("Login failed");
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{!user ? (
				<GoogleLogin onSuccess={onSuccess} onError={onFailure} />
			) : (
				<>
					<button onClick={logout}>Logout</button>

					{/* list the courses this user has created */}
					<ul>
						{courses &&
							courses?.map((course: Course) => (
								<li key={course.course_id}>{course.course_name}</li>
							))}
					</ul>
					{/* <AITutorChat /> */}
				</>
			)}
		</div>
	);
}

export default App;
