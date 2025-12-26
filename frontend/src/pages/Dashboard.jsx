import { useEffect, useState } from "react";
import Navbar from "../components/admin/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

const API = `${API_URL}/api`;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${API}/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white p-6">

      {/* ===== Top Bar ===== */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Compile<span className="text-indigo-500">AI</span>
        </h1>

        <div className="flex items-center gap-3">
          <Link
            to="/mine"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Submissions
          </Link>
          <Navbar />
        </div>
      </div>

      {/* ===== Profile Card ===== */}
      {user && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user.name} 👋
            </h2>
            <p className="opacity-70">{user.email}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
            <p className="text-sm opacity-80">Problems Solved</p>
            <h3 className="text-4xl font-extrabold mt-2">
              {user.totalSolved}
            </h3>
          </div>
        </div>
      )}

      {/* ===== Problems Table ===== */}
<div className="mt-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700">

  {/* Table Header */}
  <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
    <h2 className="text-xl font-bold">Problem List</h2>
    <span className="text-sm opacity-60">
      Total: {problems.length}
    </span>
  </div>

  {/* Scrollable Table */}
  <div className="max-h-[65vh] overflow-y-auto">
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-gray-100 dark:bg-zinc-900 z-10">
        <tr>
          <th className="px-6 py-3 text-left font-semibold">Title</th>
          <th className="px-6 py-3 text-left font-semibold">Difficulty</th>
          <th className="px-6 py-3 text-left font-semibold">Tags</th>
        </tr>
      </thead>

      <tbody>
        {problems.map((problem, index) => (
          <tr
            key={problem._id}
            className={`
              border-b border-gray-200 dark:border-zinc-700
              transition
              hover:bg-indigo-50 dark:hover:bg-zinc-700/40
              ${index % 2 === 0 ? "bg-white dark:bg-zinc-800" : "bg-gray-50 dark:bg-zinc-800/50"}
            `}
          >
            {/* Title */}
            <td className="px-6 py-4 font-medium">
              <Link
                to={`/problems/${problem._id}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {problem.title}
              </Link>
            </td>

            {/* Difficulty Badge */}
            <td className="px-6 py-4">
              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-600"
                      : problem.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-600"
                      : "bg-red-500/20 text-red-600"
                  }
                `}
              >
                {problem.difficulty}
              </span>
            </td>

            {/* Tags */}
            <td className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {problem.tags?.length > 0 ? (
                  problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}
