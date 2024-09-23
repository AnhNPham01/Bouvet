import React, { useEffect, useState } from 'react';

function UserResults({ userId }) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/user/${userId}/results`)
            .then(response => response.json())
            .then(data => setResults(data))
            .catch(error => console.error('Error fetching user results:', error));
    }, [userId]);

    return (
        <div className="oldResults">
            <h2>Your Quiz Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <p>Answers: {result.answers}</p>
                        <p>Score: {result.score}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserResults;
