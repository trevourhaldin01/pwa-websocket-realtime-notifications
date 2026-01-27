import { useEffect, useState } from "react";

export default function Suggestions() {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/suggestions')
            .then(res => res.json())
            .then(setSuggestions)
    }, [])
    return (
        <div className="w-full max-w-3xl mx-auto mt-10">
            <h3 className="text-2xl font-bold">Suggestions</h3>
            {suggestions.length === 0 ? (
                <p>No suggestions yet.</p>
            ) : (
                suggestions.map((suggestion) => (
                    <div key={suggestion?.id} className="w-full flex  flex-col items-start border-b border-gray-300 pt-4">
                        <p className="font-bold text-[24px] ">{suggestion?.title}</p>
                        <p className="font-medium w-full text-left max-h-24 wrap-break-word">{suggestion?.message}</p>
                        <p className="text-gray-500 text-xs ">{suggestion?.created_at}</p>
                    </div>
                ))
            )}
        </div>

    )
}