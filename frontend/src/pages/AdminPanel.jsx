import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  const [searchUser, setSearchUser] = useState('');
  const [searchListing, setSearchListing] = useState('');
  const [sortUser, setSortUser] = useState('');
  const [sortListing, setSortListing] = useState('');

  const [userPage, setUserPage] = useState(1);
  const [listingPage, setListingPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, listingRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/listings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(userRes.data);
        setListings(listingRes.data);
      } catch (err) {
        console.error('Admin fetch error:', err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/listings/${listingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.error('Delete listing error:', err);
    }
  };

  const filteredUsers = users
    .filter((u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
    )
    .sort((a, b) => {
      if (sortUser === 'name') return a.name.localeCompare(b.name);
      if (sortUser === 'role') return a.role.localeCompare(b.role);
      return 0;
    });

  const filteredListings = listings
    .filter((l) =>
      l.title.toLowerCase().includes(searchListing.toLowerCase()) ||
      l.location.toLowerCase().includes(searchListing.toLowerCase())
    )
    .sort((a, b) => {
      if (sortListing === 'title') return a.title.localeCompare(b.title);
      if (sortListing === 'price') return a.price - b.price;
      return 0;
    });

  const paginatedUsers = filteredUsers.slice((userPage - 1) * itemsPerPage, userPage * itemsPerPage);
  const paginatedListings = filteredListings.slice((listingPage - 1) * itemsPerPage, listingPage * itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Users</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <select
              value={sortUser}
              onChange={(e) => setSortUser(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Sort</option>
              <option value="name">Name A–Z</option>
              <option value="role">Role</option>
            </select>
          </div>
        </div>

        <ul className="space-y-3">
          {paginatedUsers.map((u) => (
            <li key={u._id} className="flex justify-between items-center border p-3 rounded bg-white shadow">
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-sm text-blue-600 capitalize">{u.role}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(u._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setUserPage(userPage - 1)}
            disabled={userPage === 1}
            className={`px-4 py-1 rounded ${userPage === 1 ? 'bg-gray-400 text-white' : 'bg-black text-white'}`}
          >
            Prev
          </button>
          <span>Page {userPage}</span>
          <button
            onClick={() => setUserPage(userPage + 1)}
            disabled={userPage * itemsPerPage >= filteredUsers.length}
            className={`px-4 py-1 rounded ${userPage * itemsPerPage >= filteredUsers.length ? 'bg-gray-400 text-white' : 'bg-black text-white'}`}
          >
            Next
          </button>
        </div>
      </div>

      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Listings</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchListing}
              onChange={(e) => setSearchListing(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <select
              value={sortListing}
              onChange={(e) => setSortListing(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Sort</option>
              <option value="title">Title A–Z</option>
              <option value="price">Price Low–High</option>
            </select>
          </div>
        </div>

        <ul className="space-y-3">
          {paginatedListings.map((l) => (
            <li key={l._id} className="flex justify-between items-center border p-3 rounded bg-white shadow">
              <div>
                <Link to={`/listings/${l._id}`} className="font-semibold hover:underline">
                  {l.title}
                </Link>
                <p className="text-sm text-gray-500">{l.location}</p>
                <p className="text-sm text-blue-600">${l.price}</p>
              </div>
              <button
                onClick={() => handleDeleteListing(l._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setListingPage(listingPage - 1)}
            disabled={listingPage === 1}
            className={`px-4 py-1 rounded ${listingPage === 1 ? 'bg-gray-400 text-white' : 'bg-black text-white'}`}
          >
            Prev
          </button>
          <span>Page {listingPage}</span>
          <button
            onClick={() => setListingPage(listingPage + 1)}
            disabled={listingPage * itemsPerPage >= filteredListings.length}
            className={`px-4 py-1 rounded ${listingPage * itemsPerPage >= filteredListings.length ? 'bg-gray-400 text-white' : 'bg-black text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
