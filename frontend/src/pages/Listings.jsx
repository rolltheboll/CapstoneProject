import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings');
        setListings(res.data);
      } catch (err) {
        setError('Failed to fetch listings');
      }
    };

    fetchListings();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Listings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Link
            key={listing._id}
            to={`/listings/${listing._id}`}
            className="block border rounded p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600 mb-1">{listing.location}</p>
            <p className="text-blue-600 font-bold">${listing.price}</p>
            <p className="text-sm text-gray-500">{listing.housingType}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
