import React, { useState, useEffect } from 'react';
const API_BASE = import.meta.env.VITE_API_URL;
import BlogFeed from '../components/BlogFeed';
import { Link } from 'react-router-dom';

const Home = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/blogs`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedBlog(data[0]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch featured blog:', err.message);
      });
  }, []);

  return (
    <section className="space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen p-6 sm:p-10">
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-md dark:from-gray-700 dark:to-gray-800">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-white">Welcome to Real-Time Blog ✨</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Share your thoughts and see them live. Create and edit blogs in real-time!
        </p>
      </div>

      {featuredBlog && (
        <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-bold text-blue-700 dark:text-white mb-1">🔥 Featured Blog</h3>
          <p className="text-gray-800 dark:text-gray-300 font-semibold mb-1">{featuredBlog.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {featuredBlog.content}
          </p>
          <Link to={`/blog/${featuredBlog.id}`} className="text-blue-600 hover:underline dark:text-blue-400">Read more →</Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        <span
          onClick={() => setSelectedTag('React')}
          className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
            selectedTag === 'React'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
          }`}
        >
          #React
        </span>
        <span
          onClick={() => setSelectedTag('NodeJS')}
          className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
            selectedTag === 'NodeJS'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
          }`}
        >
          #NodeJS
        </span>
        <span
          onClick={() => setSelectedTag('SocketIO')}
          className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
            selectedTag === 'SocketIO'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
          }`}
        >
          #SocketIO
        </span>
        <span
          onClick={() => setSelectedTag('FullStack')}
          className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
            selectedTag === 'FullStack'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
          }`}
        >
          #FullStack
        </span>
        {selectedTag && (
          <button
            onClick={() => setSelectedTag('')}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-white tracking-tight">📝 Latest Blogs</h2>
        <Link
          to="/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Blog
        </Link>
      </div>

      <BlogFeed selectedTag={selectedTag} />
    </section>
  );
};

export default Home;
