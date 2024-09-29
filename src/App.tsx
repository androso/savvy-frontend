import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout, CredentialResponse } from "@react-oauth/google";
import { jwtDecode} from "jwt-decode";
import "./App.css";
import AITutorChat from "./components/ui/Chat";


interface DecodedUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<DecodedUser | null>(null);

  const onSuccess = async (response: CredentialResponse) => {
	if (response.credential) {
	  const decoded: DecodedUser = jwtDecode(response.credential);
	  console.log("Login Success: currentUser:", decoded);
	  setUser(decoded);
	  setIsLoggedIn(true);

	  await fetch("http://localhost:3000/api/save-user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			google_id: decoded.sub,
			email: decoded.email,
			display_name: decoded.name,
			profile_picture_url: decoded.picture,
			last_login: new Date().toISOString()
		})
	  })
	}
  };

  const onFailure = () => {
	console.log("Login failed");
	setIsLoggedIn(false);
  };

  const handleLogout = () => {
	googleLogout();
	setIsLoggedIn(false);
	setUser(null);
	console.log("Logout made successfully");
  };

  return (
	<GoogleOAuthProvider clientId={clientId}>
	  <div>
		{!isLoggedIn ? (
		  <GoogleLogin
			onSuccess={onSuccess}
			onError={onFailure}
		  />
		) : (
		  <>
			<button onClick={handleLogout}>Logout</button>
			<h1>Welcome, {user?.name}</h1>
			<AITutorChat />
		  </>
		)}
	  </div>
	</GoogleOAuthProvider>
  );
}

export default App;