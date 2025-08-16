import { useEffect, useState } from "react";
import Navbar from "../components/admin/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from '../api'; 

const API = `${API_URL}/api`;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
  
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${API}/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
  
    fetchProfile();
    fetchProblems();
  }, []);
  

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-4 rounded-lg border border-gray-400">
        <h1 className="text-2xl font-bold mb-4 px-4 pt-2">CompileAI</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/mine"
            className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white"
          >
            My Submissions
          </Link>
          <Navbar />
        </div>
        
      </div>

      {/* Profile Section */}        
      {user && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Welcome {user.name} 👋</h2>
          <div className="flex justify-between">
          <p className="ml-8"><strong>Name:</strong> {user.name}</p>
          <p className="mr-8"><strong>Questions Solved:</strong> {user.totalSolved}</p>
          </div>
          <p className="ml-8"><strong>Email:</strong> {user.email}</p>
          
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">ProblemList</h1>
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
                <Link
                  to={`/problems/${problem._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {problem.title}
                </Link>
              </td>
              <td className="py-2 px-4">{problem.difficulty}</td>
              <td className="py-2 px-4">{problem.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
