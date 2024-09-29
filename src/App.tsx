import {
	GoogleLogin,
	googleLogout,
	CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useUser } from "./lib/useUser";
import "./App.css";
import AITutorChat from "./components/ui/Chat";

interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string;
}

function App() {
	const { user, isLoading, saveUser, removeUser } = useUser();

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

	const handleLogout = () => {
		googleLogout();
		removeUser();
		console.log("Logout made successfully");
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
					<button onClick={handleLogout}>Logout</button>
					<h1>Welcome, {user.name}</h1>
					<AITutorChat />
				</>
			)}
		</div>
	);
}

export default App;
