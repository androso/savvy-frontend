import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Review from "./components/ui/Review";
import Notes from "./components/ui/Notes.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={clientId}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/review" element={<Review />} />
						<Route path="/notes" element={<Notes />} />
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	</StrictMode>
);
