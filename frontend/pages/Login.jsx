import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 overflow-hidden">
      {/* Transparent Glass Card */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-white mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 border border-white/40 rounded-lg bg-transparent/10 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>
        </div>


          <button
            type="submit"
            className="w-full bg-indigo-600 text-black font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-white/80 text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-yellow-300 font-medium hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
