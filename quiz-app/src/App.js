import React, { useState } from 'react';
import Register from './components/register';
import Login from './components/login';
import Quiz from './components/quiz';
import UserResults from './components/userResults';

import './App.css';

function App() {
    const [userId, setUserId] = useState(null); // State to hold user ID

    // Function to handle successful login
    const handleLogin = (id) => {
        setUserId(id); // Set the user ID after successful login
    };

    // Function to reset user state for logout
    const handleLogout = () => {
        setUserId(null); // Log out the user
    };

    return (
        <div className="App">
            {/* If the user is not logged in, show login and register forms */}
            {!userId ? (
                <div>
                    <Login onLogin={handleLogin} />
                    <Register />
                </div>
            ) : (
                // If the user is logged in, show the quiz and a logout button
                <div>
                    {/* Add the Login button to allow logging out */}
                    <LogoutButton onLogout={handleLogout} />
                    <Quiz userId={userId} />
                    <UserResults userId={userId} />
                </div>
            )}
        </div>
    );
}

// Logout button component displayed when the user is logged in
const LogoutButton = ({ onLogout }) => {
    return (
        <button className="logout-button" onClick={onLogout}>
            Logout
        </button>
    );
};

export default App;
