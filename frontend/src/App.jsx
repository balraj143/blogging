import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import CreateBlog from "../pages/CreateBlog";
import BlogDetails from "../pages/BlogDetails";
import Profile from "../pages/Profile";
import ProfilePage from "../pages/ProfilePage";
import BlogList from "../pages/BlogList";
import SavedBlogs from "../pages/SavedBlogs";
import FollowingAuthors from "../pages/FollowingAuthors";
import AdminDashboard from "../pages/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage (fast, avoids redirect issues)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Admin protected route
  const AdminRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!currentUser || !token) return <Navigate to="/login" />;
    if (currentUser.role !== "admin") return <Navigate to="/" />;
    return children;
  };

  // Logged-in user protected route
  const ProtectedRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Navbar />
      <div className="">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedBlogs /></ProtectedRoute>} />
        <Route path="/following" element={<ProtectedRoute><FollowingAuthors /></ProtectedRoute>} />

        {/* Profile page by ID */}
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Blog routes */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </Router>
  );
}

<h1 className="text-4xl font-bold text-red-500">Tailwind is working 🎉</h1>
export default App;
