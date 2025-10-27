import { useState,useEffect } from 'react';
import { register } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import image3 from '../assets/image3.png';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import {motion} from 'framer-motion';
import { Eye, EyeOff } from "lucide-react"; 

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registered successfully ✅');
      navigate('/login');
    } catch (err) {
      alert('Registration failed ❌');
    }
  };

  return (
    <>
    <motion.div
      className="flex min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50"
      initial={{ opacity: 0, y: 20 }} // fade + slight slide
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} // fade + slide out
      transition={{ duration: 0.5 }}
    >
    <Link to="/"><h1 className="text-2xl font-bold text-indigo-600 mt-4 ml-4">CompileAI</h1></Link>
    <div className='w-1/2 flex items-center justify-center'>
    <motion.div
        className=" max-w-xl w-1/2 mx-auto p-8  bg-white rounded-2xl shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} required className="border p-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-2" />
        <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
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
        <select name="role" onChange={handleChange} className="border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Register</button>
      </form>
      </motion.div>
    </div>

    <div className='w-1/2 h-screen'>
      <img src={image3} alt='photo' className='w-full h-full object-cover rounded-bl-[100px]'></img>
    </div>

    </motion.div>
    </>
  );
}
