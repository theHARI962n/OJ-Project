import { useState } from 'react';
import { register } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} required className="border p-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-2" />
        <select name="role" onChange={handleChange} className="border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2">Register</button>
      </form>
    </div>
  );
}
