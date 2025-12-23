import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

const API = `${API_URL}/api`;

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
  const [errorDetails, setErrorDetails] = useState(null);

  // 🆕 AI feedback state
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`${API}/problems/${id}`);
      const data = await res.json();
      setProblem(data);
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setVerdict("");
    setErrorDetails(null);
    try {
      const res = await fetch(`${API}/submit`, {
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
      if (!res.ok) {
        // Show server-provided message (which may include compiler error details)
        const serverMsg = data?.message || data?.error || "Request failed";
        setVerdict(serverMsg);
        // If the server included partial test results or compiler info, show it too
        if (data?.submission?.testResults)
          setTestResults(data.submission.testResults);
        if (data?.testResults) setTestResults(data.testResults);
        setErrorDetails(data);
        return;
      }

      setVerdict(
        data?.submission?.verdict || data?.message || "Unknown server error"
      );
      setTestResults(data?.submission?.testResults || []);
    } catch (err) {
      console.error("Submit error:", err);
      // Prefer server-sent details when available
      const serverData = err?.response?.data || null;
      if (serverData) {
        setVerdict(serverData.message || JSON.stringify(serverData));
        setErrorDetails(serverData);
        if (serverData.testResults) setTestResults(serverData.testResults);
      } else {
        setVerdict(err.message || "Error submitting code");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Small helper to clean markdown formatting
  function cleanMarkdown(text) {
    if (!text) return "";

    return (
      text
        // Remove standalone bold markers on their own line
        .replace(/\n\*\*\s*\n/g, "\n")
        // Remove trailing bold markers with no text
        .replace(/\*\*\s*$/g, "")
        // Remove starting bold markers with no text
        .replace(/^\s*\*\*\s*/g, "")
        // Fix double line breaks before bullets
        .replace(/\n\s*\*\s+/g, "\n- ")
        // Collapse multiple newlines
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    );
  }

  const handleAIReview = async () => {
    if (!code.trim()) {
      setAiFeedback({ review: null, hints: "⚠️ Please enter code first." });
      return;
    }

    setAiLoading(true);
    try {
      const res = await axios.post(
        `${API}/ai-review`,
        {
          code,
          problemTitle: problem.title,
          problemDescription: problem.description,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAiFeedback({
        review: cleanMarkdown(res.data.review),
        hints: cleanMarkdown(res.data.hints),
      });
    } catch (err) {
      console.error("AI review error:", err);
      setAiFeedback({ review: null, hints: "❌ Failed to get AI review" });
    }
    setAiLoading(false);
  };

  if (!problem) return <div className="p-6">Loading problem...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Column */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r rounded-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">CompileAI</h1>

          <Link
            to="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          >
            Go to Dashboard
          </Link>
        </div>
        <h4 className="text-xl font-bold mb-4">Q. {problem.title}</h4>
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

        {/* 🆕 AI Review Button */}
        <button
          onClick={handleAIReview}
          disabled={aiLoading}
          className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 mt-4"
        >
          {aiLoading ? "Reviewing..." : "🧠 AI Review"}
        </button>

        {/* 🆕 AI Feedback Box */}
        {aiFeedback && (
          <div className="mt-4 p-3 bg-yellow-50 border rounded">
            {aiFeedback.review && (
              <>
                <h3 className="font-semibold text-lg mb-1">AI Review:</h3>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{aiFeedback.review}</ReactMarkdown>
                </div>
              </>
            )}
            {aiFeedback.hints && (
              <>
                <h3 className="font-semibold text-lg mb-1">Hints:</h3>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{aiFeedback.hints}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 p-6 flex flex-col ">
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
          className="border rounded"
        />

        {/* Verdict */}
        {verdict && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <strong>Result:</strong> {verdict}
          </div>
        )}

        {/* Error / Compiler Details */}
        {errorDetails && (
          <div className="mt-2 p-3 bg-red-50 border rounded text-sm">
            <strong>Details:</strong>
            <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40 text-xs">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Results */}
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
