import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}/profile`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!profile) return <p className="p-6">No profile found.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-2xl font-bold">{profile?.user?.name}</h2>
        <p className="text-gray-600">{profile?.user?.email}</p>
        <p>👥 Followers: {profile.user.followers.length}</p>
         <p>➡️ Following: {profile.user.following.length}</p>
      </div>

      {/* User's Blogs */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          📝 Blogs by {profile?.user?.name}
        </h3>
        {profile?.blogs?.length === 0 ? (
          <p>No blogs yet.</p>
        ) : (
          <ul className="space-y-2">
            {profile.blogs.map((b) => (
              <li key={b._id} className="p-3 border rounded">
                <h4 className="font-bold">{b.title}</h4>
                <p className="text-sm text-gray-600">
                  {b.content?.slice(0, 80)}...
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Liked Blogs */}
      <div>
        <h3 className="text-xl font-semibold mb-2">❤️ Liked Blogs</h3>
        {profile?.likedBlogs?.length === 0 ? (
          <p>No liked blogs yet.</p>
        ) : (
          <ul className="space-y-2">
            {profile.likedBlogs.map((b) => (
              <li key={b._id} className="p-3 border rounded">
                <h4 className="font-bold">{b.title}</h4>
                <p className="text-sm text-gray-600">by {b?.author?.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Saved Blogs */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🔖 Saved Blogs</h3>
        {profile?.savedBlogs?.length === 0 ? (
          <p>No saved blogs yet.</p>
        ) : (
          <ul className="space-y-2">
            {profile.savedBlogs.map((b) => (
              <li key={b._id} className="p-3 border rounded">
                <h4 className="font-bold">{b.title}</h4>
                <p className="text-sm text-gray-600">by {b?.author?.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
