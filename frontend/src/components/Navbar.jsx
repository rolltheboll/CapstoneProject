import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white-600 text-black shadow">
        
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      
        <Link to="/" className="text-xl font-bold">Stay4less</Link>
        
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/listings" className="hover:underline">Listings</Link>
        </div>
      </div>
    </nav>
  );
}
