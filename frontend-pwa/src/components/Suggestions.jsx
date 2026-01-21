import { useEffect, useState } from "react";

export default function Suggestions() {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/suggestions')
            .then(res => res.json())
            .then(setSuggestions)
    }, [])
    return (
        <div>
            <h3>Suggestions</h3>
            {suggestions.length === 0 ? (
                <p>No suggestions yet.</p>
            ) : (
                suggestions.map((suggestion) => (
                    <div key={suggestion.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                        <h4>{suggestion.title}</h4>
                        <p>{suggestion.description}</p>
                    </div>
                ))
            )}
        </div>

    )
}