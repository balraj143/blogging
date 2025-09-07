// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             {/* Logo */}
//             <Link to="/" className="text-xl font-bold text-indigo-600">
//               Blogging Platform
//             </Link>

//             {/* Desktop Menu */}
//             <div className=" space-x-10 items-center justify-end ">
//               <Link to="/" className="text-gray-700 hover:text-blue-600">
//                 Home
//               </Link>
//               <Link to="/blogs" className="text-gray-700 hover:text-blue-600">
//                 Blogs
//               </Link>
//               {token ? (
//                 <>
//                   <Link to="/create" className="text-gray-700 hover:text-blue-600">
//                     Create
//                   </Link>
//                   <Link to="/profile" className="text-gray-700 hover:text-blue-600">
//                     Profile
//                   </Link>
//                   {user?.role === "admin" && (
//                     <Link to="/admin" className="text-gray-700 hover:text-blue-600">
//                       Admin
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="text-gray-700 hover:text-blue-600">
//                     Login
//                   </Link>
//                   <Link to="/register" className="text-gray-700 hover:text-blue-600">
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Mobile Hamburger */}
//             <div className="">
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="text-gray-700 focus:outline-none text-2xl"
//               >
//                 ☰
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className=" bg-white px-4 pb-3 space-y-2 shadow mt-16">
//           <Link to="/" className="block hover:text-indigo-600">
//             Home
//           </Link>
//           <Link to="/blogs" className="block hover:text-indigo-600">
//             Blogs
//           </Link>
//           {token ? (
//             <>
//               <Link to="/create" className="block hover:text-indigo-600">
//                 Create
//               </Link>
//               <Link to="/profile" className="block hover:text-indigo-600">
//                 Profile
//               </Link>
//               {user?.role === "admin" && (
//                 <Link to="/admin" className="block hover:text-indigo-600">
//                   Admin
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block hover:text-indigo-600">
//                 Login
//               </Link>
//               <Link to="/register" className="block hover:text-indigo-600">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       )}

//       {/* Spacer so content isn't hidden under navbar */}
//       <div className="h-16"></div>
//     </>
//   );
// };

// export default Navbar;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="top-0 z-50 bg- shadow-md bg-pink-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            MyBlog
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/blogs" className="hover:text-indigo-600">Blogs</Link>

            {token ? (
              <>
                <Link to="/create" className="hover:text-indigo-600">Create</Link>
                <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
                <Link to="/saved" className="hover:text-indigo-600">Saved</Link>
                <Link to="/following" className="hover:text-indigo-600">Following</Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="hover:text-indigo-600">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center  space-x-1 text-red-500 hover:text-red-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-600">Login</Link>
                <Link to="/register" className="hover:text-indigo-600">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/blogs" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Blogs</Link>

          {token ? (
            <>
              <Link to="/create" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Create</Link>
              <Link to="/profile" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Profile</Link>
              <Link to="/saved" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Saved</Link>
              <Link to="/following" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Following</Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Admin</Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block hover:text-indigo-600" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
