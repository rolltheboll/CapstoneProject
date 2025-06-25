import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inquiries/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInquiries(res.data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/favorites', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
    };

    if (user?.role === 'student') {
      fetchInquiries();
      fetchFavorites();
    }
  }, [user]);

  const handleCancel = async (inquiryId) => {
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInquiries((prev) => prev.filter((inq) => inq._id !== inquiryId));
    } catch (err) {
      console.error('Failed to cancel inquiry:', err);
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${listingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFavorites((prev) => prev.filter((fav) => fav.listing._id !== listingId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="flex flex-col md:flex-row md:space-x-6">
       
        <section className="flex-1 mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Your Inquiries</h2>
          {inquiries.length === 0 ? (
            <p>No inquiries yet.</p>
          ) : (
            <ul className="space-y-4">
              {inquiries.map((inq) => (
                <li key={inq._id} className="p-4 border rounded shadow bg-white bg-opacity-90">
                  <p>
                    <strong>Listing:</strong>{' '}
                    {inq.listing ? (
                      <Link
                        to={`/listings/${inq.listing._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {inq.listing.title}
                      </Link>
                    ) : (
                      'Listing unavailable'
                    )}
                  </p>
                  <p><strong>Message:</strong> {inq.message}</p>
                  <p><strong>Status:</strong> {inq.status || 'Pending'}</p>
                  <button
                    className="bg-black text-red-500 px-3 py-1 rounded mt-2"
                    onClick={() => handleCancel(inq._id)}
                  >
                    Cancel Inquiry
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        
        <section className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
          {favorites.length === 0 ? (
            <p>No favorites saved.</p>
          ) : (
            <ul className="space-y-4">
              {favorites.map((fav) => {
                const listing = fav.listing;
                return (
                  <li key={fav._id} className="p-4 border rounded shadow bg-white bg-opacity-90">
                    <p>
                      <strong>Title:</strong>{' '}
                      {listing ? (
                        <Link
                          to={`/listings/${listing._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {listing.title}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </p>
                    <p><strong>Location:</strong> {listing?.location || 'N/A'}</p>
                    <p><strong>Price:</strong> ${listing?.price || 'N/A'}</p>
                    <p><strong>Type:</strong> {listing?.housingType || 'N/A'}</p>
                    <button
                      className="bg-black text-red-500 px-3 py-1 rounded mt-2"
                      onClick={() => handleRemoveFavorite(listing._id)}
                    >
                      Remove from Favorites
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
