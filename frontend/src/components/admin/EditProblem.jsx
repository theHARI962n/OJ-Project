import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProblem() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    difficulty: '',
    tags: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5050/api/problems/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const problem = res.data;
      setFormData({
        title: problem.title,
        description: problem.description,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        difficulty: problem.difficulty,
        tags: problem.tags.join(', ')
      });
    };

    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      const payload = { ...formData, tags: tagsArray };

      await axios.put(`http://localhost:5050/api/problems/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Problem updated!');
      navigate('/admin/problems');
    } catch (err) {
      alert('❌ Failed to update');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Problem</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="inputFormat"
          value={formData.inputFormat}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="outputFormat"
          value={formData.outputFormat}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Comma separated tags"
          className="w-full border px-3 py-2 rounded"
        />

        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Update Problem
        </button>
      </form>
    </div>
  );
}
