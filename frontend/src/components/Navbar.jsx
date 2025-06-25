import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow text-black">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-purple-700 hover:underline">
          Stay4less
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/listings" className="hover:underline text-purple-600 transition">
            Listings
          </Link>

          {user?.role === 'student' && (
            <Link to="/student-dashboard" className="hover:underline text-purple-600 transition">
              Dashboard
            </Link>
          )}

          {user?.role === 'landlord' && (
            <>
              <Link to="/dashboard" className="hover:underline text-purple-600 transition">
                Dashboard
              </Link>
              <Link
                to="/create-listing"
                className="px-3 py-1 text-sm bg-white text-purple-600 border border-purple-600 rounded hover:bg-purple-100 transition"
              >
                + New Listing
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:underline text-purple-600 transition">
              Admin Panel
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:underline text-purple-600 transition">
                Login
              </Link>
              <Link to="/register" className="hover:underline text-purple-600 transition">
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1 text-sm !text-purple-600 !bg-white !border !border-purple-600 rounded hover:!bg-purple-100 transition"
            >
              {user.name || user.email}
            </button>
          
            {dropdownOpen && (
           <div className="absolute right-0 mt-2 w-48 rounded border !border-purple-600 !bg-white shadow z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 w-full text-left !text-purple-600 hover:!bg-purple-100 transition"
          >
           Profile
            </Link>
             <button
               onClick={logout}
              className="block w-full px-4 py-2 text-left !bg-white !text-purple-600 !border-none hover:!bg-purple-100 transition"
                 >
                  Logout
                </button>
               </div>
              )}

          </div>
          
          )}
        </div>
      </div>
    </nav>
  );
}
