import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useUser } from "./lib/useUser";
import "./App.css";
import AITutorChat from "./components/ui/Chat";
import Login from "./components/ui/login";

interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string;
}

function App() {
	const { user, isLoading, saveUser, logout } = useUser();

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
<<<<<<< HEAD
			{!user ? (
				<GoogleLogin onSuccess={onSuccess} onError={onFailure} />
			) : (
				<>
					<button onClick={logout}>Logout</button>
					<AITutorChat />
				</>
			)}
=======
      <AITutorChat />
	  <Login />
>>>>>>> 41b9ebc (Login)
		</div>
	);
}

export default App;
