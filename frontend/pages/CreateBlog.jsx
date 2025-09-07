import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../src/utils/axiosInstance";

function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWT
      const res = await axiosInstance.post(
        "/blogs",
        {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Blog created:", res.data);
      navigate("/"); // redirect to home or blogs list
    } catch (err) {
      console.error("Error creating blog:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          ✍️ Create New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Image URL */}
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-white/40 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Rich Text Editor */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Write your blog here..."
              className="h-40"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition duration-200"
          >
            🚀 Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
