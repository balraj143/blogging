import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch blog
  const fetchBlog = async () => {
    try {
      const res = await axiosInstance.get(`/blogs/${id}`);
      setBlog(res.data);
      setEditForm({ title: res.data.title, content: res.data.content });
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // ---------------- FOLLOW ----------------
  const handleFollow = async () => {
    try {
      const res = await axiosInstance.post(
        `/users/${blog.author._id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(!isFollowing);
      alert(res.data.msg);
    } catch (err) {
      console.error("Error following author:", err);
    }
  };

  // ---------------- DELETE BLOG ----------------
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axiosInstance.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  // ---------------- UPDATE BLOG ----------------
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/blogs/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlog(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  // ---------------- SAVE BLOG ----------------
  const handleSaveBlog = async () => {
    try {
      const res = await axiosInstance.post(
        `/blogs/${id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  // ---------------- LIKE BLOG ----------------
  const handleLike = async () => {
    try {
      await axiosInstance.post(
        `/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlog(); // refresh likes
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  // ---------------- ADD COMMENT ----------------
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axiosInstance.post(
        `/blogs/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchBlog();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ---------------- DELETE COMMENT ----------------
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await axiosInstance.delete(`/blogs/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlog();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // ---------------- EDIT COMMENT ----------------
  const handleEditComment = async (commentId, newText) => {
    try {
      await axiosInstance.put(
        `/blogs/${id}/comments/${commentId}`,
        { text: newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlog();
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  // ---------------- REPORT BLOG ----------------
  const handleReport = async () => {
    try {
      await axiosInstance.post(
        `/blogs/${id}/report`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Report submitted!");
      setShowReportForm(false);
      setReportReason("");
    } catch (err) {
      console.error("Error reporting blog:", err);
      alert(err.response?.data?.msg || "Failed to report blog");
    }
  };

  if (!blog) return <p className="p-6 text-center">Loading blog...</p>;

  const canManageBlog =
    user &&
    (user.id?.toString() === blog.author?._id?.toString() ||
      user.role === "admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300 p-6 pt-20">
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-10">
        {!isEditing ? (
          <>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{blog.title}</h1>
            <p className="text-gray-600 mt-2">By {blog.author?.name}</p>

            <div
              className="mt-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Actions */}
            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={handleLike}
                className="bg-pink-500 hover:bg-pink-600 text-black px-4 py-2 rounded-lg shadow-md"
              >
                ❤️ {blog.likes?.length || 0} Likes
              </button>
              <button
                onClick={handleSaveBlog}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg shadow-md"
              >
                Save
              </button>
              {user && blog.author && user._id !== blog.author._id && (
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-lg shadow-md ${
                    isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                  } text-black`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            {/* Report Blog */}
            <div className="mt-8">
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg"
                >
                  Report Blog
                </button>
              ) : (
                <div className="border p-4 rounded-lg bg-gray-100">
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Why are you reporting this blog?"
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleReport}
                      className="bg-red-600 hover:bg-red-700 text-black px-4 py-2 rounded-lg"
                    >
                      Submit Report
                    </button>
                    <button
                      onClick={() => setShowReportForm(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="mt-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Comments</h2>

              {token && (
                <form onSubmit={handleAddComment} className="flex gap-2 mt-4 flex-col sm:flex-row">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border p-2 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg"
                  >
                    Post
                  </button>
                </form>
              )}

              <div className="mt-6 space-y-3">
                {blog.comments?.length ? (
                  blog.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border p-3 rounded-lg bg-white flex justify-between items-center"
                    >
                      <span>
                        <strong>{comment.user?.name || "Unknown"}:</strong> {comment.text}
                      </span>
                      {user &&
                        (comment.user?._id?.toString() === user.id?.toString() ||
                          user.role === "admin") && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                const newText = prompt("Edit your comment:", comment.text);
                                if (newText?.trim()) handleEditComment(comment._id, newText);
                              }}
                              className="text-blue-500 text-sm hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No comments yet.</p>
                )}
              </div>
            </div>

            {/* Manage Blog (Author/Admin only) */}
            {canManageBlog && (
              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border p-3 rounded-lg"
              placeholder="Title"
            />
            <textarea
              value={editForm.content}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full border p-3 rounded-lg"
              rows="6"
              placeholder="Content"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
