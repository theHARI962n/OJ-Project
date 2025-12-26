import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { API_URL } from "../api";

const API = `${API_URL}/api`;

export default function ProblemPage() {
  const { id } = useParams();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  /* ================= STATE ================= */
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(
`#include<iostream>
using namespace std;
int main(){
    int a,b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`
  );
  const [verdict, setVerdict] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${API}/problems/${id}`)
      .then(res => res.json())
      .then(setProblem);
  }, [id]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setLoading(true);
    setVerdict("");
    setTestResults([]);
    setErrorDetails(null);

    try {
      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ problemId: id, language: "cpp", code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVerdict(data.message || "Submission failed");
        setErrorDetails(data);
        return;
      }

      setVerdict(data.submission.verdict);
      setTestResults(data.submission.testResults);
    } catch {
      setVerdict("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AI REVIEW ================= */
  const handleAIReview = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post(
        `${API}/ai-review`,
        {
          code,
          problemTitle: problem.title,
          problemDescription: problem.description,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAiFeedback(res.data);
    } catch {
      setAiFeedback({ hints: "AI review failed" });
    } finally {
      setAiLoading(false);
    }
  };

  if (!problem) return <div className="p-10">Loading...</div>;

  /* ================= THEME CLASSES ================= */
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#0f0f1a] via-[#0b1220] to-black text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      } p-6`}
    >
      <div className="grid md:grid-cols-2 gap-6">

        {/* ================= LEFT PANEL ================= */}
        <div className={`rounded-2xl p-6 shadow-xl border ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">CompileAI</h1>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border hover:scale-110 transition"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/dashboard" className="flex items-center text-sm">
                <ArrowLeft size={16} className="mr-1" /> Back
              </Link>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
          <p className="mb-4 opacity-80">{problem.description}</p>
          {/* ===== Problem Meta Info ===== */}
<div className="mt-4 space-y-3">

  {/* Difficulty */}
  <div className="flex items-center gap-2">
    <span className="text-sm opacity-70">Difficulty:</span>
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold
      ${
        problem.difficulty === "Easy"
          ? "bg-green-500/20 text-green-500"
          : problem.difficulty === "Medium"
          ? "bg-yellow-500/20 text-yellow-600"
          : "bg-red-500/20 text-red-500"
      }`}
    >
      {problem.difficulty}
    </span>
  </div>

  {/* Tags */}
  {problem.tags?.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {problem.tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-400"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}

  {/* Input / Output */}
  <div className="flex flex-col md:flex-col md:gap-3 gap-3 mt-3">
    <div className="p-3 rounded-lg bg-black/10">
      <p className="text-xs opacity-60 mb-1">Input Format</p>
      <p className="font-mono text-sm">{problem.inputFormat}</p>
    </div>

    <div className="p-3 rounded-lg bg-black/10">
      <p className="text-xs opacity-60 mb-1">Output Format</p>
      <p className="font-mono text-sm">{problem.outputFormat}</p>
    </div>
  </div>
</div>


          <button
            onClick={handleAIReview}
            disabled={aiLoading}
            className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white hover:brightness-110"
          >
            {aiLoading ? "Reviewing..." : "🧠 AI Review"}
          </button>

          {aiFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-black/10">
              <ReactMarkdown>{aiFeedback.review || aiFeedback.hints}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-green-600 text-white hover:scale-105 transition"
          >
            {loading ? "Running..." : "▶ Run Code"}
          </button>

          <div className="rounded-xl overflow-hidden border">
            <CodeMirror
              value={code}
              height="360px"
              extensions={[cpp()]}
              onChange={setCode}
            />
          </div>

          {verdict && (
            <div className={`p-3 rounded-lg text-center font-semibold ${
              verdict.includes("Passed")
                ? "bg-green-500/20 text-green-600"
                : "bg-red-500/20 text-red-600"
            }`}>
              {verdict}
            </div>
          )}

          {/* ================= SCROLLABLE TEST RESULTS ================= */}
          {testResults.length > 0 && (
            <div className="rounded-xl border p-3">
              <h3 className="font-semibold mb-2">Test Case Results</h3>

              <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2">
                {testResults.map((tr, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      tr.isCorrect
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <p className="text-xs opacity-60">Input</p>
                    <p className="font-mono">{tr.input}</p>

                    <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                      <div>
                        <p className="opacity-60">Expected</p>
                        <p className="font-mono">{tr.expectedOutput}</p>
                      </div>
                      <div>
                        <p className="opacity-60">Output</p>
                        <p className="font-mono">{tr.actualOutput}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorDetails && (
            <pre className="text-xs bg-red-100 text-red-600 p-3 rounded">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
