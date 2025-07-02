import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messageInputs, setMessageInputs] = useState({});

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inquiries/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const filtered = res.data.filter((inq) => inq.listing);
        setInquiries(filtered);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/favorites', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const filtered = res.data.filter((fav) => fav.listing);
        setFavorites(filtered);
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
      setFavorites((prev) => prev.filter((fav) => fav.listing?._id !== listingId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleMessageChange = (inquiryId, text) => {
    setMessageInputs((prev) => ({ ...prev, [inquiryId]: text }));
  };

  const handleSendMessage = async (inquiryId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/inquiries/${inquiryId}/messages`,
        { body: messageInputs[inquiryId] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessageInputs((prev) => ({ ...prev, [inquiryId]: '' }));

      const res = await axios.get('http://localhost:5000/api/inquiries/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const filtered = res.data.filter((inq) => inq.listing);
      setInquiries(filtered);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="flex flex-col md:flex-row md:space-x-6">
        <section className="flex-1 overflow-auto max-h-[80vh] mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Your Inquiries</h2>
          {inquiries.length === 0 ? (
            <p>No inquiries yet.</p>
          ) : (
            <ul className="space-y-4">
              {inquiries.map((inq) => (
                <li key={inq._id} className="p-4 border rounded shadow bg-white bg-opacity-90">
                  <p>
                    <strong>Listing:</strong>{' '}
                    <Link to={`/listings/${inq.listing._id}`} className="text-blue-600 hover:underline">
                      {inq.listing.title}
                    </Link>
                  </p>

                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border p-2 bg-gray-50 rounded">
                    {inq.messages.map((msg, idx) => (
                      <div key={idx}>
                        <strong>{msg.sender.name}:</strong> {msg.body}
                        <div className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2">
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Write a message..."
                      value={messageInputs[inq._id] || ''}
                      onChange={(e) => handleMessageChange(inq._id, e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSendMessage(inq._id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      >
                        Send Message
                      </button>
                      <button
                        className="bg-black text-red-500 px-3 py-1 rounded"
                        onClick={() => handleCancel(inq._id)}
                      >
                        Cancel Inquiry
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex-1 overflow-auto max-h-[80vh]">
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
                      <Link to={`/listings/${listing._id}`} className="text-blue-600 hover:underline">
                        {listing.title}
                      </Link>
                    </p>
                    <p><strong>Location:</strong> {listing.location}</p>
                    <p><strong>Price:</strong> ${listing.price}</p>
                    <p><strong>Type:</strong> {listing.housingType}</p>
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
