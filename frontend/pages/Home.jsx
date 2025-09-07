import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function Home() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
        navigate("/login"); // redirect if not logged in
      }
    };
    fetchUser();
  }, [navigate]);

  // ✅ Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Greeting */}
        {user ? (
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
            Hello, {user.name} 👋
          </h2>
        ) : (
          <p className="text-white mb-6">Loading user...</p>
        )}

        {/* Blogs */}
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Latest Blogs
        </h1>

        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30 hover:scale-[1.02] transition-transform duration-300"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-yellow-200 mb-2">
                  By {blog.author?.name || "Unknown"}
                </p>
                <p className="text-white/80 mb-4">
                  {blog.content.substring(0, 120)}...
                </p>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-sm px-4 py-2 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-300 transition"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/80 text-center mt-6">
            No blogs available. Be the first to post!
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
