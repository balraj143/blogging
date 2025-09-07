import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../src/utils/axiosInstance";

function FollowingAuthors() {
  const [authors, setAuthors] = useState([]);
  const [followCount, setFollowCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const hasFetched = useRef(false); // ✅ prevent multiple API calls

  useEffect(() => {
    const fetchFollowing = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Redirect if user is not logged in
      if (!storedUser || !token) {
        navigate("/login");
        return;
      }

      const userId = JSON.parse(storedUser)?.id; // use "id", not "_id"
      if (!userId) {
        console.error("Invalid user ID in localStorage");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const res = await axiosInstance.get(`/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure authors is an array
        const following = Array.isArray(res.data.user.following)
          ? res.data.user.following
          : [];

        const followers = Array.isArray(res.data.user.followers)
          ? res.data.user.followers
          : [];

        setAuthors(following);
        setFollowCount(following.length);
        setFollowerCount(followers.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching following list:", err);
        setError("Failed to fetch following list.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [navigate]);

  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-white mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          👤 Following Authors
        </h2>

        <p className="text-center text-white/80 mb-4">
          Followers: {followerCount} | Following: {followCount}
        </p>

        {authors.length === 0 ? (
          <p className="text-center text-white/80">
            You are not following anyone yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {authors.map((a) => (
              <li
                key={a._id}
                className="bg-white/10 border border-white/30 p-5 rounded-lg shadow-md text-white hover:scale-105 transition transform duration-300"
              >
                <h3 className="text-xl font-semibold">{a.name}</h3>
                <p className="text-white/70 text-sm">{a.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FollowingAuthors;
