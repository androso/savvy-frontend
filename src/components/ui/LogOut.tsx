import React from 'react';

interface LogOutProps {
    onLogOut: () => void;
}

const LogOut: React.FC<LogOutProps> = ({ onLogOut }) => {
    return (
        <button onClick={onLogOut}>
            Log Out
        </button>
    );
};

export default LogOut;