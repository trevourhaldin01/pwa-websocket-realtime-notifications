import { useState } from "react";

export default function SuggestionForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, message }),
      });
      if (!res.ok) throw new Error("Failed to submit suggestion");
      setTitle("");
      setMessage("");
      alert("Suggestion submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded">
      <h2 className="text-2xl font-bold">Submit a Suggestion</h2>
      <form onSubmit={handleSubmit} className="p-4">

        <input
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border-t-0 border-l-0 border-r-0 border-b mb-4 focus:outline-none focus:border-b-2"
        />
        <textarea
          placeholder="Message..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-2 border-t-0 border-l-0 border-r-0 border-b focus:outline-none focus:border-b-2 mb-4"
        />

        <button
          type="submit"
          className={
            `w-full bg-black hover:bg-gray-700 disabled:bg-gray-400  text-white p-2
             `
            }
        
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>



      </form>
    </div>
  );
}
