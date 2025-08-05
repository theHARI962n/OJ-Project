import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    difficulty: 'Easy',
    tags: ''
  });

  const navigate = useNavigate();

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

      await axios.post('http://localhost:5050/api/problems', payload, {
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
    <div className=''>
    <div className="mx-auto mt-20 px-6 py-6 border border-gray-300 max-w-xl">
     
     <h2 className="text-2xl font-bold mb-4 ">➕ Create New Problem</h2>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded "
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="inputFormat"
          placeholder="Input Format"
          value={formData.inputFormat}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="outputFormat"
          placeholder="Output Format"
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
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create
        </button>
      </form>
    </div>
    </div>
    
  );
}
