import React, { useEffect, useState, useRef } from 'react';
const API_BASE = import.meta.env.VITE_API_URL;
import socket from '../socket';
import toast from 'react-hot-toast';

const token = localStorage.getItem('token');
let userId = null;

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userId = payload.id;
  } catch (err) {
    console.error("Invalid token:", err);
    userId = null;
  }
}

const BlogFeed = ({ searchTerm = '', selectedTag = '' }) => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const titleInputRef = useRef();

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial posts
  useEffect(() => {
    fetch(`${API_BASE}/api/blogs`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => {
        console.error('Failed to fetch posts:', err.message);
        toast.error('Error loading posts');
      });
  }, []);

  // Listen for new posts in real-time
  useEffect(() => {
    const handleNewPost = () => {
      fetch(`${API_BASE}/api/blogs`)
        .then(res => res.json())
        .then(data => {
          setPosts(data);
          toast.success('New post loaded!');
        });
    };

    socket.on('new_post_created', handleNewPost);

    return () => {
      socket.off('new_post_created', handleNewPost);
    };
  }, []);

  useEffect(() => {
    if (editingPost) {
      titleInputRef.current?.focus();
    }
  }, [editingPost]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this post?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        toast.success('Post deleted!');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Delete failed');
      }
    } catch {
      toast.error('Server error during delete');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null);
    setEditPreview(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('content', editContent);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const res = await fetch(`${API_BASE}/api/blogs/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
        setEditingPost(null);
        toast.success('Post updated!');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Update failed');
      }
    } catch {
      toast.error('Server error during update');
    }

    setIsSaving(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag
      ? post.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
        post.content.toLowerCase().includes(selectedTag.toLowerCase())
      : true;

    return matchesSearch && matchesTag;
  });

  console.log("All posts:", posts);

  return (

    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-300 animate-fadeIn dark:bg-gray-800 dark:text-white"
        >
          {post.image_url && (
            <>
              {console.log("Rendering image:", post.image_url)}
              <img
                src={`${API_BASE}${post.image_url}`}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </>
          )}
          <div className="p-4 space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{post.title}</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{post.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm uppercase shadow-sm">
                  {(post.author?.username || post.author?.email)?.[0]}
                </div>
                <span className="font-medium">{post.author?.username || post.author?.email}</span>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] dark:bg-gray-700 dark:text-gray-300">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => handleEdit(post)} className="text-blue-600 hover:underline text-sm">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline text-sm">Delete</button>
            </div>
          </div>
        </div>
      ))}
      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-500 mt-10 dark:text-gray-400 animate-fadeIn">
          <img
            src="https://illustrations.popsy.co/gray/blog-writing.svg"
            alt="No posts"
            className="mx-auto w-52 h-auto mb-4"
          />
          <p className="text-lg font-semibold">No blog posts found</p>
          <p className="text-sm">Try creating a new one or check your search keyword.</p>
        </div>
      )}
      {editingPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setEditingPost(null)}
        >
          <div
            className="bg-white p-6 rounded shadow max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                ref={titleInputRef}
                type="text"
                className="w-full block border p-2 rounded"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full block border p-2 rounded"
                rows="4"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditImage(file);
                    setEditPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full border p-2 rounded file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-lg hover:file:bg-blue-100 transition"
                />
                {editPreview && (
                  <img
                    src={editPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover mt-2 rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default BlogFeed;