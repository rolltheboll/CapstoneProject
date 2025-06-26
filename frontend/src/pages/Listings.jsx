import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Listings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    housingType: '',
    priceMin: '',
    priceMax: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.housingType) params.append('housingType', filters.housingType);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);

      const res = await axios.get(`http://localhost:5000/api/listings?${params.toString()}`);
      setListings(res.data);
      setError('');
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch listings');
    }
  };

  const fetchFavorites = async () => {
    if (user?.role !== 'student') return;
    try {
      const res = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites(res.data.map(f => f.listing._id));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const handleAddFavorite = async (listingId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/favorites',
        { listingId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFavorites(prev => [...prev, listingId]);
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${listingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites(prev => prev.filter(id => id !== listingId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchFavorites();
    }
  }, [user]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const indexOfLast = currentPage * listingsPerPage;
  const indexOfFirst = indexOfLast - listingsPerPage;
  const currentListings = listings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Available Listings</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white bg-opacity-90 p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <select
            name="housingType"
            value={filters.housingType}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="shared">Shared</option>
            <option value="homestay">Homestay</option>
            <option value="private">Private</option>
          </select>
          <input
            type="number"
            name="priceMin"
            placeholder="Min Price"
            value={filters.priceMin}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Max Price"
            value={filters.priceMax}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentListings.map((listing) => {
          const isFavorite = favorites.includes(listing._id);

          return (
            <div
              key={listing._id}
              className="block border rounded p-4 shadow hover:shadow-lg transition bg-white bg-opacity-90"
            >
              <Link to={`/listings/${listing._id}`}>
                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-1">{listing.location}</p>
                <p className="text-blue-600 font-bold">${listing.price}</p>
                <p className="text-sm text-gray-500">{listing.housingType}</p>
              </Link>
              {user?.role === 'student' && (
                <button
                  onClick={() =>
                    isFavorite
                      ? handleRemoveFavorite(listing._id)
                      : handleAddFavorite(listing._id)
                  }
                  className={`mt-3 text-sm px-3 py-1 rounded ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
