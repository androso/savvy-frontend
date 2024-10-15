import React from 'react';
import { GoogleLogin } from 'react-google-login';
import HappyMan from '../../img/HappyMan.png'; 

const Login: React.FC = () => {
    const handleLoginSuccess = (response: any) => {
        console.log('Login Success:', response);
        // Handle successful login here
    };

    const handleLoginFailure = (response: any) => {
        console.log('Login Failed:', response);
        // Handle failed login here
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 p-8 bg-white bg-opacity-60 rounded-lg shadow-lg backdrop-blur-sm">
                <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center font-sans">Welcome</h1>
                <img src={HappyMan} alt="Happy Man" className="w-80 h-80 mx-auto mb-4" />
                <GoogleLogin
                    clientId="YOUR_GOOGLE_CLIENT_ID"
                    buttonText="Sign in with Google"
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    className="mt-4 mx-auto block"
                />
                <p className="mt-4 text-sm text-gray-600 text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
