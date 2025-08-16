import { useEffect, useState } from "react";
import { API_URL } from "../api";


const API = `${API_URL}/api`;

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/submit/my-submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Problem</th>
              <th className="px-4 py-2 border">Verdict</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id}>
                <td className="px-4 py-2 border">{sub.problemId?.title || "Deleted Problem"}</td>
                <td className="px-4 py-2 border">{sub.verdict}</td>
                <td className="px-4 py-2 border">
                  {new Date(sub.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
