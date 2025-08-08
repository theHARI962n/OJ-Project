import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Panel 🛠️</h1>
        <Navbar /> {/* This will render the logout button on the same line */}
      </div>
      <ul className="space-y-2">
      <div className='flex flex-row gap-3'>
        <li><Link className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-md text-white" to="/admin/problems">📚 Manage Problems</Link></li>
        <li><Link className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-md text-white" to="/admin/problems/create"> Create New Problem</Link></li>
      </div>
        
      </ul>
    </div>
  );
}
