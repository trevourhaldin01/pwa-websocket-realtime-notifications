import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(()=>{
    if(isAuthenticated){
      navigate("/suggestions");
    }
  },[isAuthenticated, navigate]);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.access_token);
        navigate("/suggestions");
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded">
      <h2 className="text-2xl font-bold">Login to view suggestions</h2>
      <form onSubmit={handleLogin} className="p-4">
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border-t-0 border-l-0 border-r-0 border-b mb-4 focus:outline-none focus:border-b-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border-t-0 border-l-0 border-r-0 border-b mb-4 focus:outline-none focus:border-b-2"
        />
        <button 
        type="submit"
        className={
            `w-full bg-black hover:bg-gray-700 disabled:bg-gray-400  text-white p-2
             `
            }
        disabled={loading}
        >
          Login
        </button>
      </form>
    </div>
  );
}
