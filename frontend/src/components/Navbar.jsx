
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-600 text-black shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center ">
        <Link to="/" className="text-xl font-bold">Stay4less</Link>

        <div className="space-x-4">
          <Link to="/listings" className="hover:underline">Listings</Link>

          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}

          {user?.role === 'student' && <Link to="/student-dashboard" className="hover:underline">Dashboard</Link>}
          {user?.role === 'landlord' && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="hover:underline">Admin Panel</Link>}

          {user && (
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded ml-4">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
