import { useState } from 'react';
import { register } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import image3 from '../assets/image3.png';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className=' flex min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50'>
    <Link to="/"><h1 className="text-2xl font-bold text-indigo-600 mt-4 ml-4">CompileAI</h1></Link>
    <div className='w-1/2 flex items-center justify-center'>
    <div className=" max-w-xl w-1/2 mx-auto p-8  bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} required className="border p-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-2" />
        <select name="role" onChange={handleChange} className="border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Register</button>
      </form>
    </div>
    </div>

    <div className='w-1/2 h-screen'>
      <img src={image3} alt='photo' className='w-full h-full object-cover rounded-bl-[100px]'></img>
    </div>
    </div>
    </>
  );
}
