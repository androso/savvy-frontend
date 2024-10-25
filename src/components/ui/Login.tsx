import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HappyMan from '../../img/HappyMan.png'; 
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { DecodedUser } from '@/types/types';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/lib/useUser';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {saveUser, user, isLoading} = useUser();
    const handleLoginSuccess = (response: CredentialResponse) => {
        if (response.credential) {
			const decoded: DecodedUser = jwtDecode(response.credential);
			console.log("Login Success: currentUser:", decoded);
			saveUser(decoded);
		}
    };

    useEffect(() => {
        if (!isLoading && user) {
            navigate('/');
        }
    })

    const handleLoginFailure = () => {
        console.error('Login Failed');
        
       
        setErrorMessage('Login failed. Please try again or check your internet connection.');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden">
           
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 p-8 bg-white bg-opacity-60 rounded-lg shadow-lg backdrop-blur-sm">
                <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center font-sans">Welcome</h1>
                <img src={HappyMan} alt="Happy Man" className="w-80 h-80 mx-auto mb-4" />
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure} 
                    />
                </div>
                
                {errorMessage && (
                    <p className="mt-4 text-sm text-red-600 text-center">
                        {errorMessage}
                    </p>
                )}
                <p className="mt-4 text-sm text-gray-600 text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
