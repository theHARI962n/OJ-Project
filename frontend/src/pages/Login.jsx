import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.time("LoginTime");

    try {
      const res = await login(form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      alert("Login failed ❌");
    } finally {
      setLoading(false);
      console.timeEnd("LoginTime");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 relative flex flex-col">
      {/* Top-left logo */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-indigo-600">CompileAI</h1>
        </Link>
      </div>

      {/* Centered login box */}
      <motion.div
        className="flex-grow flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full bg-white p-6 rounded-3xl shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <h6 className="mb-2 text-gray-600">Login to use your dashboard</h6>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="border p-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
            {/* 👇 Password field with toggle */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                required
                className="border p-2 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <h6 className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 transition"
              >
                Sign up
              </Link>
            </h6>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
