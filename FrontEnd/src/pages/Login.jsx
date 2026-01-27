import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      login(res.data);

      const role = res.data.role;

      if (role === "ROLE_ADMIN") navigate("/admin");
      else if (role === "ROLE_SELLER") navigate("/seller");
      else navigate("/customer");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">

      <form onSubmit={submit} className="bg-white w-[380px] p-10 rounded-xl shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          IntelliMart Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <input
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <div
          className="text-right text-sm text-blue-600 mb-4 cursor-pointer hover:underline"
          onClick={() => alert("Password reset coming soon")}
        >
          Forgot password?
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
}
