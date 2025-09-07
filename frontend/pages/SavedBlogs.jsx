import { useEffect, useState } from "react";
import axiosInstance from "../src/utils/axiosInstance";

function SavedBlogs() {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSaved = async () => {
    try {
      const res = await axiosInstance.get("/blogs/saved/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedBlogs(res.data);
    } catch (err) {
      console.error("Error fetching saved blogs:", err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (blogId) => {
    try {
      const res = await axiosInstance.post(
        `/blogs/${blogId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg); // optional feedback
      fetchSaved(); // refresh the list after unsave
    } catch (err) {
      console.error("Error unsaving blog:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          💾 Saved Blogs
        </h1>

        {savedBlogs.length === 0 ? (
          <p className="text-center text-white/80">No blogs saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white/10 border border-white/30 p-6 rounded-lg shadow-md text-white hover:scale-105 transition transform duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-white/80 mb-3">
                  {blog.content.substring(0, 120)}...
                </p>
                <p className="text-sm text-white/60 mb-3">
                  Saved on: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleUnsave(blog._id)}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg"
                >
                  Unsave
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedBlogs;
