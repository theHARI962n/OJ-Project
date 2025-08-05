import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel 🛠️</h1>
      <ul className="space-y-2">
        <li><Link className="text-blue-600 underline" to="/admin/problems">📚 Manage Problems</Link></li>
        <li><Link className="text-blue-600 underline" to="/admin/problems/create">➕ Create New Problem</Link></li>
      </ul>
    </div>
  );
}
