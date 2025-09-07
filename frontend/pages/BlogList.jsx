import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // 🔎 Filter blogs based on search + tags
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.content.toLowerCase().includes(search.toLowerCase());

    const matchesTag = !selectedTag || blog.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Explore Blogs
        </h1>

        {/* 🔎 Search + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="w-full md:flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <option value="">All Tags</option>
            <option value="at">@</option>
            <option value="hash">#</option>
            <option value="ex">!</option>
          </select>
        </div>

        {/* 📃 Blog List */}
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/30 hover:scale-[1.02] transition-transform duration-300"
              >
                <Link to={`/blogs/${blog._id}`}>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-white/80 mb-3">
                  {blog.content.slice(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-yellow-400 text-black font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/80 mt-6">No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default BlogList;
