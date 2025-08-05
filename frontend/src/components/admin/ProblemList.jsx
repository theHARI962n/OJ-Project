import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/problems', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/problems/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProblems(problems.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 All Problems</h2>

      <Link to="/admin/problems/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">+ Create Problem</Link>

      <table className="min-w-full mt-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Difficulty</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} className="border-t">
              <td className="px-4 py-2">{problem.title}</td>
              <td className="px-4 py-2">{problem.difficulty}</td>
              <td className="px-4 py-2">
                <Link
                  to={`/admin/problems/edit/${problem._id}`}
                  className="text-blue-500 hover:underline mr-4"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="text-red-500 hover:underline"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
