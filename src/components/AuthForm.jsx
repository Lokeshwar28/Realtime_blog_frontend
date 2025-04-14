import React, { useState } from 'react';
const API_BASE = import.meta.env.VITE_API_URL;

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'login' : 'register';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;
      console.log("👉 Sending request to:", `${API_BASE}/api/auth/${endpoint}`);
    const res = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log("🧾 Status:", res.status);
    const data = await res.json();
    console.log("🔁 Response data:", data);
    if (res.ok) {
      localStorage.setItem('token', data.token);
      onAuth(); // trigger update in App
    } else {
      setError(data.message || 'Auth failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition duration-300"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p
          className="text-sm text-center text-blue-600 hover:underline cursor-pointer"
          onClick={toggleMode}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;