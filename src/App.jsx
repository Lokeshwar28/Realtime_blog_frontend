import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import AuthForm from './components/AuthForm';
import BlogDetail from './pages/BlogDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const decodeJWT = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      const parsedPayload = JSON.parse(payload);
      return parsedPayload.email;
    } catch (error) {
      return '';
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      const email = decodeJWT(token);
      setUserEmail(email);
    }
  };

  useEffect(() => {
    checkAuth();
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-sky-50 to-slate-100'}`}>
      <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 dark:text-white">📝 Real-Time Blog</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-sm px-3 py-1 rounded border border-gray-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:border-white"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            {isAuthenticated && (
              <>
                <span
                  title={userEmail}
                  className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-sm border dark:bg-white dark:text-blue-600"
                >
                  {userEmail?.[0]?.toUpperCase()}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 rounded border border-gray-300 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-gray-700 dark:text-red-400 dark:border-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              isAuthenticated
                ? <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                : <AuthForm onAuth={checkAuth} />
            } />
            <Route path="/create" element={
              isAuthenticated
                ? <CreateBlog isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                : <AuthForm onAuth={checkAuth} />
            } />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;