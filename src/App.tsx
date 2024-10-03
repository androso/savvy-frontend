import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useUser } from "./lib/useUser";
import "./App.css";
import { useCourses } from "./lib/useCourses";
import { Button } from "./components/ui/button";
import NavigationBar from "./components/ui/NavigationBar";
import { Course, DecodedUser } from "./types/types";

function App() {
	const { user, saveUser, logout, isLoading } = useUser();
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
					<div className="min-h-screen bg-background text-foreground p-6 flex flex-col">
						<div className="flex-grow">
							<div className="flex justify-center mb-4">
								<div className="w-12 h-12 bg-red-600 rounded-full"></div>
							</div>
							<h1 className="text-2xl font-semibold text-center mb-8">
								Bienvenido, {user.name}
							</h1>
							{/* list the courses this user has created */}
							<div className="space-y-4 mb-6">
								{courses &&
									courses.map((course: Course) => (
										<Button
											variant="outline"
											className="w-full py-6 text-lg font-medium bg-card hover:bg-accent "
											key={course.course_id}
										>
											{course.course_name}
										</Button>
									))}
							</div>
							<p className="text-center text-sm text-muted-foreground">
								Selecciona un curso para estudiarlo
							</p>
						</div>
					</div>
					<NavigationBar />
					<button onClick={logout}>Logout</button>

				</>
			)}
		</div>
	);
}

export default App;
