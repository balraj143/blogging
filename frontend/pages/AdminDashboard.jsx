import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";
import {
  Table, TableBody, TableCell, TableHead, TableRow
} from "../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select";
import { Button } from "../components/ui/button";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Admin check
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" />;
  }

  const [users, setUsers] = useState([]);
  const [reportedBlogs, setReportedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, blogsRes] = await Promise.all([
          axiosInstance.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get("/admin/reported-blog", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(usersRes.data);
        setReportedBlogs(blogsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  // Delete blog
  const deleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axiosInstance.delete(`/admin/blogs/${blogId}`, { headers: { Authorization: `Bearer ${token}` } });
      setReportedBlogs(prev => prev.filter(b => b._id !== blogId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  if (loading) return <p className="p-6">Loading admin dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 pt-20 flex justify-center">
      <div className="w-full max-w-6xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-10 border border-white/30">
        
        {/* Users Table */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">👤 Manage Users</h2>
          {users.length === 0 ? (
            <p className="text-white/80">No users found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/20">
              <Table>
                <TableHead className="bg-white/10">
                  <TableRow>
                    <TableCell className="text-white font-semibold">Name</TableCell>
                    <TableCell className="text-white font-semibold">Email</TableCell>
                    <TableCell className="text-white font-semibold">Role</TableCell>
                    <TableCell className="text-white font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id} className="hover:bg-white/10">
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={val => updateUserRole(user._id, val)}
                        >
                          <SelectTrigger className="w-[120px] bg-white/20 text-black border border-white/30">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="!text-black">
                        <Button
                        className="!text-black"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user._id)}
                          disabled={user._id === currentUser._id} // cannot delete yourself
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Reported Blogs Table */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">⚠️ Reported Blogs</h2>
          {reportedBlogs.length === 0 ? (
            <p className="text-white/80">No reported blogs.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/20">
              <Table>
                <TableHead className="bg-white/10">
                  <TableRow>
                    <TableCell className="text-white font-semibold">Title</TableCell>
                    <TableCell className="text-white font-semibold">Author</TableCell>
                    <TableCell className="text-white font-semibold">Reports</TableCell>
                    <TableCell className="text-white font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportedBlogs.map((blog) => (
                    <TableRow key={blog._id} className="hover:bg-white/10">
                      <TableCell className="!text-white">
                        <Link to={`/blogs/${blog._id}`} className="!text-white hover:underline">
                          {blog.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-white">
                        {blog.author?.name || blog.author?.username || "Unknown"}
                      </TableCell>
                      <TableCell className="text-white">{blog.reports?.length || 0}</TableCell>
                      <TableCell className="!text-black">
                        <Button
                         className="!text-black"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBlog(blog._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
