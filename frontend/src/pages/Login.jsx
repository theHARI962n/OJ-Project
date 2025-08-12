import { useState, useEffect } from 'react';
import { login } from '../services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful ✅');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      alert('Login failed ❌');
    }
  };

  return (
    <>
    <div className='  min-h-screen items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 pt-4 px-4'>
    <Link to="/"><h1 className="text-2xl font-bold text-indigo-600 ">CompileAI</h1></Link>
    <div className='pt-[150px]'>
    <div className=" max-w-md mx-auto   bg-white p-6 rounded-3xl shadow">
      <h2 className="text-2xl font-bold ">Welcome Back</h2>
      <h6 className='mb-2 text-gray-600'>Login to use your dashboard</h6>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-2 rounded-xl" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-2 rounded-xl" />
        <h6 className='text-gray-600'>Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 transition">Sign up</Link></h6>
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Login</button>
      </form>
    </div>
    </div>
    
    </div>
    </>
  );
}
