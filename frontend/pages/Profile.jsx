import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  // ✅ Fetch logged-in user blogs
  const fetchMyBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs/myblogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Start editing blog
  const startEdit = (blog) => {
    setEditingBlog(blog._id);
    setForm({
      title: blog.title,
      content: blog.content,
      tags: blog.tags?.join(",") || "",
    });
  };

  // ✅ Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/blogs/${editingBlog}`, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      });
      setEditingBlog(null);
      fetchMyBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          📝 My Blogs
        </h2>

        {blogs.length === 0 ? (
          <p className="text-white text-center">No blogs created yet.</p>
        ) : (
          <ul className="space-y-6">
            {blogs.map((blog) => (
              <li
                key={blog._id}
                className="bg-white/10 border border-white/30 p-6 rounded-lg shadow-md text-white"
              >
                {editingBlog === blog._id ? (
                  // ✅ Edit Form
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400"
                    />
                    <textarea
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400"
                      rows="4"
                    />
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) =>
                        setForm({ ...form, tags: e.target.value })
                      }
                      placeholder="Comma separated tags"
                      className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBlog(null)}
                        className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // ✅ Blog Display
                  <>
                    <h3 className="text-xl font-semibold">{blog.title}</h3>
                    <p className="text-white/80">
                      {blog.content.slice(0, 120)}...
                    </p>
                    <p className="text-sm text-white/60 mt-1">
                      Tags:{" "}
                      {blog.tags?.length > 0 ? blog.tags.join(", ") : "None"}
                    </p>
                    <p className="text-sm text-white/60">
                      Created at:{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => startEdit(blog)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
