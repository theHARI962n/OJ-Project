import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/problems');
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📘 Problem List</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Difficulty</th>
            <th className="py-2 px-4 text-left">Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">
                <Link to={`/problems/${problem._id}`} className="text-blue-600 hover:underline">
                  {problem.title}
                </Link>
              </td>
              <td className="py-2 px-4">{problem.difficulty}</td>
              <td className="py-2 px-4">{problem.tags.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
