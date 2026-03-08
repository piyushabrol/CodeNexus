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
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-[#0f172a]/70 backdrop-blur-md p-8 rounded-2xl w-96 shadow-xl border border-white/10">

        <div className="flex items-center justify-center gap-3 mb-6">
          <LogoMark size={32} />
          <h2 className="text-2xl font-bold text-emerald-400">CodeNexus</h2>
        </div>

        <h3 className="text-lg font-semibold mb-6 text-center text-gray-200">
          Register
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-400"
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
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg font-semibold transition duration-200 shadow-lg"
          >
            Register
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;