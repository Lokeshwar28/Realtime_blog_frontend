import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Blog not found');
        return res.json();
      })
      .then(data => setBlog(data))
      .catch(err => setBlog(null));
  }, [id]);

  if (blog === null) {
    return <p className="text-center text-red-500">Blog not found 🥲</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 bg-white rounded-xl shadow-md">
      <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      <h1 className="text-3xl font-bold text-blue-800">{blog.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold uppercase shadow-sm">
          {(blog.author?.username || blog.author?.email)?.[0]}
        </div>
        <span className="font-medium">{blog.author?.username || blog.author?.email}</span>
        <span>·</span>
        <span>{new Date(blog.created_at).toLocaleString()}</span>
      </div>
      {blog.image_url && (
        <img
          src={`${API_BASE}${blog.image_url}`}
          alt={blog.title}
          className="rounded-xl shadow-md"
        />
      )}
      <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">{blog.content}</p>
    </div>
  );
};

export default BlogDetail;