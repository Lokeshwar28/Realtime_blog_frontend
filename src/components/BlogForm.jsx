import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token'); // temporary auth handling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const res = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    setIsSubmitting(false);
    if (res.ok) {
      setMessage('✅ Blog posted!');
      setTitle('');
      setContent('');
      setImage(null);
      setPreview(null);
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8 space-y-4 border border-gray-200 animate-fadeIn">
        <h2 className="text-2xl font-semibold border-b pb-2 text-blue-700">Create a New Blog Post</h2>
        {message && <div className="text-sm text-center font-medium text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-md">{message}</div>}
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 transition duration-150 ease-in-out"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          {image && (
            <p className="text-xs text-gray-500 mt-1 italic">Selected file: {image.name}</p>
          )}
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg border-2 border-blue-100 shadow-md"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;