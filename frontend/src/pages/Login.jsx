import { useState } from 'react';
import { login } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-2" />
        <button type="submit" className="bg-green-500 text-white py-2">Login</button>
      </form>
    </div>
  );
}
