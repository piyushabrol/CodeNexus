import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LogoMark from "../components/LogoMark";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Register() {
  const [form, setForm] = useState({
    name: "",
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

  // Normal Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/register", form);

      login(res.data);
      navigate("/problems");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Registration Failed ❌");
    }
  };

  // Google Register/Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const res = await axios.post("/auth/google", {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
      });

      login(res.data);
      navigate("/problems");

    } catch (err) {
      console.log(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh] overflow-hidden">
      {/* AMBIENT RADIAL GLOW BLOB */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 bg-[#0f172a]/60 backdrop-blur-md p-8 rounded-2xl w-96 shadow-2xl border border-white/5 animate-fadeIn">
        <div className="flex items-center justify-center gap-3 mb-6">
          <LogoMark size={32} />
          <h2 className="text-xl font-bold tracking-tight text-white">
            Code<span className="text-emerald-400 font-extrabold">Nexus</span>
          </h2>
        </div>

        <h3 className="text-xs font-semibold mb-6 text-center text-gray-400 uppercase tracking-wider">
          Create Account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs text-gray-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-2.5 rounded-lg text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition duration-200"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] uppercase text-gray-500 font-bold">or</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white py-2.5 rounded-lg font-bold text-sm transition duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;