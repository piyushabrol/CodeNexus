import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LogoMark from "../components/LogoMark";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);

      login(res.data);       // store token + user
      navigate("/problems"); // redirect
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-[#0f172a]/70 backdrop-blur-md p-8 rounded-2xl w-96 shadow-xl border border-white/10">

        
        <div className="flex items-center justify-center gap-3 mb-6">
          <LogoMark size={32} />
          <h2 className="text-2xl font-bold text-green-400">CodeNexus</h2>
        </div>

        <h3 className="text-lg font-semibold mb-6 text-center text-gray-200">
          Login
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400"
              required
            />
          </div>

          <button
            type="submit"
           className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg font-semibold transition duration-200 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* optional link */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          New here?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;