import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError('Failed to load listing details');
      }
    };

    fetchListing();
  }, [id]);

  
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/inquiries',
        { listingId: id, message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setInquirySent(true);
      setMessage('');
    } catch (err) {
      setError('Failed to send inquiry.');
    }
  };

  
  if (error) return <p className="text-red-600">{error}</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-2">{listing.location}</p>
      <p className="text-blue-600 text-lg font-semibold mb-2">${listing.price}</p>
      <p className="text-sm mb-4 capitalize">{listing.housingType}</p>
      <p className="mb-6">{listing.description}</p>

      {listing.images?.length > 0 && (
        <img
          src={listing.images[0]}
          alt="Listing"
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}

      {}
      {user?.role === 'student' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Send Inquiry</h2>
          {inquirySent ? (
            <p className="text-green-600">Inquiry sent successfully!</p>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <textarea
                className="w-full border p-2 rounded"
                rows="4"
                placeholder="Write your message to the landlord..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
