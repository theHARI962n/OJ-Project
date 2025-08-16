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
    <div className="mx-auto mt-20 px-6 py-6 border border-gray-300 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">➕ Create New Problem</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        <input type="text" name="title" placeholder="Title"
          value={formData.title} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />

        <textarea name="description" placeholder="Description" rows="4"
          value={formData.description} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />

        <input type="text" name="inputFormat" placeholder="Input Format"
          value={formData.inputFormat} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />

        <input type="text" name="outputFormat" placeholder="Output Format"
          value={formData.outputFormat} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" required />

        <select name="difficulty" value={formData.difficulty}
          onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input type="text" name="tags" placeholder="Tags (comma separated)"
          value={formData.tags} onChange={handleChange}
          className="w-full border px-3 py-2 rounded" />

        {/* Test Cases */}
        <div className="border p-3 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Test Cases</h3>
          {formData.testCases.map((tc, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" name="input" placeholder="Input"
                value={tc.input} onChange={(e) => handleTestCaseChange(index, e)}
                className="border px-2 py-1 rounded w-1/2" required />
              <input type="text" name="expectedOutput" placeholder="Expected Output"
                value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, e)}
                className="border px-2 py-1 rounded w-1/2" required />
              {formData.testCases.length > 1 && (
                <button type="button" onClick={() => removeTestCase(index)}
                  className="text-red-500">✖</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTestCase}
            className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400">
            ➕ Add Test Case
          </button>
        </div>

        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create
        </button>
      </form>
    </div>
  );
}
