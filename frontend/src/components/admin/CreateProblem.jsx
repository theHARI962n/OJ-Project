import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../api";

const API = `${API_URL}/api`;

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    difficulty: 'Easy',
    tags: '',
    testCases: [{ input: '', expectedOutput: '' }]
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTestCaseChange = (index, e) => {
    const updated = [...formData.testCases];
    updated[index][e.target.name] = e.target.value;
    setFormData((prev) => ({ ...prev, testCases: updated }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }]
    }));
  };

  const removeTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      const payload = { 
        ...formData, 
        tags: tagsArray,
        testCases: formData.testCases.map(tc => ({
          input: tc.input.trim(),
          expectedOutput: tc.expectedOutput.trim()
        }))
      };

      await axios.post(`${API}/problems`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Problem created!');
      navigate('/admin/problems');
    } catch (err) {
      alert('❌ Failed to create problem');
      console.error(err);
    }
  };

  return (
  <div className="min-h-screen bg-blue-50 px-6 py-12 flex justify-center">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800"> Create New Problem</h2>
        <p className="text-gray-500 text-sm mt-2">
          Add a new coding challenge with description, difficulty, tags, and test cases.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter problem title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Describe the problem in detail"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Input Format */}
        <div>
          <label className="font-semibold">Input Format</label>
          <input
            type="text"
            name="inputFormat"
            placeholder="Example: First line contains an integer N"
            value={formData.inputFormat}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Output Format */}
        <div>
          <label className="font-semibold">Output Format</label>
          <input
            type="text"
            name="outputFormat"
            placeholder="Example: Print the result in a new line"
            value={formData.outputFormat}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="font-semibold">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="font-semibold">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="DP, Arrays, Bitmask..."
            value={formData.tags}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring focus:ring-indigo-200"
          />
        </div>

        {/* Test Cases Section */}
        <div className="bg-gray-50 border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Test Cases</h3>

          {formData.testCases.map((tc, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 mb-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  name="input"
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  className="w-1/2 border px-3 py-2 rounded-lg focus:ring focus:ring-indigo-200"
                  required
                />
                <input
                  type="text"
                  name="expectedOutput"
                  placeholder="Expected Output"
                  value={tc.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  className="w-1/2 border px-3 py-2 rounded-lg focus:ring focus:ring-indigo-200"
                  required
                />
              </div>

              {formData.testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="text-red-500 font-semibold self-end hover:text-red-600"
                >
                  ✖ Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTestCase}
            className="bg-gray-300 px-3 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            ➕ Add Test Case
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition text-lg shadow"
        >
          Create Problem
        </button>
      </form>
    </div>
  </div>
  );
}
