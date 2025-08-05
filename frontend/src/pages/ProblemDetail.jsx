import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(
    "#include<iostream>\nusing namespace std;\nint main(){\n  \n  return 0;\n}"
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await axios.get(`http://localhost:5050/api/problems/${id}`);
      setProblem(res.data);
      // Set default expectedOutput if needed
      setExpectedOutput("9"); // you can fetch actual from problem data if stored
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5050/api/submit",
        {
          problemId: id,
          code,
          language: "cpp",
          input,
          expectedOutput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOutput(res.data.submission.actualOutput);
      setVerdict(res.data.submission.verdict);
    } catch (err) {
      alert("Submission failed ❌");
      console.error(err);
    }
  };

  if (!problem) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* LEFT SECTION – Problem Details + Input/Output */}
      <div className="md:w-1/2 space-y-4">
        <h2 className="text-2xl font-bold">{problem.title}</h2>
        <p className="text-gray-700">{problem.description}</p>
        <p>
          <strong>Input Format:</strong> {problem.inputFormat}
        </p>
        <p>
          <strong>Output Format:</strong> {problem.outputFormat}
        </p>

        <div className="mt-6">
          <label className="block mb-1 font-semibold">Input:</label>
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />

          <label className="block mt-4 mb-1 font-semibold">
            Expected Output:
          </label>
          <input
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          {output && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p>
                <strong>Output:</strong> {output}
              </p>
              <p>
                <strong>Verdict:</strong> {verdict}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION – Code Editor */}
      <div className="md:w-1/2">
        <label className="block mb-2 font-semibold">Code:</label>
        <CodeMirror
          value={code}
          height="600px"
          extensions={[cpp()]}
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  );
}
