# Realtime Blog Frontend

This is the frontend of the Realtime Blog Application built with React and Tailwind CSS. It allows users to register, log in, create, view, edit, and delete blog posts with real-time updates powered by Socket.IO.

## 🔗 Live Demo

Frontend: [https://realtime-blog-frontend.vercel.app](https://realtime-blog-frontend.vercel.app)  
Backend: [https://realtime-blog-backend.onrender.com](https://realtime-blog-backend.onrender.com)

---

## ⚙️ Technologies Used

- React
- Tailwind CSS
- Axios
- Socket.IO Client
- React Router DOM
- Vite

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/               # Page-level components like Home, CreateBlog, BlogDetail
├── services/            # Axios interceptors and API calls
├── App.jsx              # App routes
├── main.jsx             # Entry point
└── index.css            # Tailwind styles
```

---

## 🚀 Features

- 🔐 Authentication (JWT-based login/signup)
- 📝 Create, Read, Update, Delete (CRUD) for blog posts
- 📷 Upload images with previews
- 🔁 Real-time blog updates using Socket.IO
- 📱 Responsive and mobile-friendly layout
- 🌙 Clean and modern UI with Tailwind CSS

---

## 🛠️ Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Lokeshwar28/Realtime_blog_frontend.git
cd Realtime_blog_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and configure:

```
VITE_API_URL=https://realtime-blog-backend.onrender.com
```

4. Run the application:

```bash
npm run dev
```

---

## 🧠 Author

**Lokeshwar Reddy Gummireddy**  
MS in Computer Science | Texas Tech University  
📧 [reddylokesh142@gmail.com](mailto:reddylokesh142@gmail.com)

---

## 📃 License

This project is licensed under the MIT License.