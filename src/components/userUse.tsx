import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

const useUser = (userId: number) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: User = await response.json();
                setUser(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return { user, loading, error };
};

export default useUser;