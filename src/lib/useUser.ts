import { googleLogout } from "@react-oauth/google";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string; // Google ID
}

const fetchUser = async (): Promise<DecodedUser | null> => {
	const user = Cookies.get("user");
	return user ? JSON.parse(user) : null;
};

const saveUser = async (user: DecodedUser) => {
	Cookies.set("user", JSON.stringify(user), {
		secure: true,
		sameSite: "strict",
        expires: 7
	});
	await fetch("http://localhost:3000/api/save-user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			google_id: user.sub,
			email: user.email,
			display_name: user.name,
			profile_picture_url: user.picture,
			last_login: new Date().toISOString(),
		}),
	});
};

const removeUser = async () => {
	Cookies.remove("user");
    
};

export const useUser = () => {
	const queryClient = useQueryClient();
	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
	});
	const navigate = useNavigate()

	useEffect(() => {
		if (!isLoading && !user) {
			navigate('/login')
		}
	}, [isLoading, user, navigate])

	const saveUser = async (user: DecodedUser) => {
		const response = await axios.post("/api/save-user", {
			google_id: user.sub,
			email: user.email,
			display_name: user.name,
			profile_picture_url: user.picture,
			last_login: new Date().toISOString(),
		});

		const userId = response.data.data.user_id;
		user.user_id = userId;

		Cookies.set("user", JSON.stringify(user), {
			secure: true,
			sameSite: "strict",
			expires: 7,
		});
		queryClient.setQueryData(["user"], user);
	};

	const saveUserMutation = useMutation({
		mutationFn: saveUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const removeUserMutation = useMutation({
		mutationFn: removeUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

    const logout = () => {
        googleLogout()
        removeUserMutation.mutate()
    }

	return {
		user,
		isLoading,
		saveUser: saveUserMutation.mutate,
		removeUser: removeUserMutation.mutate,
        logout
	};
};