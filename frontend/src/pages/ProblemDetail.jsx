// src/pages/ProblemPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(
    `#include<iostream>\nusing namespace std;\nint main(){\n    int a,b; cin >> a >> b; \n    cout << a + b; \n    return 0;\n}`
  );
  const [language, setLanguage] = useState("cpp");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5050/api/problems/${id}`);
      const data = await res.json();
      setProblem(data);
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    console.log("Run Code clicked!");
    setLoading(true);
    setVerdict("");
    try {
      const res = await fetch("http://localhost:5050/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          problemId: id,
          language,
          code,
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setVerdict(data.submission?.verdict || data.message);

      // ✅ Store testResults in state
      if (data.submission?.testResults) {
        console.log("Setting testResults:", data.submission.testResults); // Debug log
        setTestResults(data.submission.testResults);
      } else {
        setTestResults([]);
      }

    } catch (err) {
      console.error("Submit error:", err);
      setVerdict("Error submitting code");
    }
    setLoading(false);
  };

  if (!problem) return <div className="p-6">Loading problem...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Column - Problem Details */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r">
        <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
        <p className="mb-4">{problem.description}</p>
        <div className="mb-2">
          <strong>Input Format:</strong>
          <p>{problem.inputFormat}</p>
        </div>
        <div className="mb-2">
          <strong>Output Format:</strong>
          <p>{problem.outputFormat}</p>
        </div>
        <div className="mb-2">
          <strong>Difficulty:</strong> {problem.difficulty}
        </div>
        <div className="mb-2">
          <strong>Tags:</strong> {problem.tags.join(", ")}
        </div>
      </div>

      {/* Right Column - Code Editor */}
      <div className="w-full md:w-1/2 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="cpp">C++</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        <CodeMirror
          value={code}
          height="400px"
          extensions={[cpp()]}
          onChange={(value) => setCode(value)}
        />

        {/* Verdict Display */}
        {verdict && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <strong>Result:</strong> {verdict}
          </div>
        )}

        {testResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Case Results:</h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Input</th>
                  <th className="border px-2 py-1">Expected Output</th>
                  <th className="border px-2 py-1">Your Output</th>
                  <th className="border px-2 py-1">Result</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((tr, idx) => (
                  <tr
                    key={idx}
                    className={tr.isCorrect ? "bg-green-50" : "bg-red-50"}
                  >
                    <td className="border px-2 py-1">{tr.input}</td>
                    <td className="border px-2 py-1">{tr.expectedOutput}</td>
                    <td className="border px-2 py-1">{tr.actualOutput}</td>
                    <td className="border px-2 py-1">
                      {tr.isCorrect ? "✅ Passed" : "❌ Failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
