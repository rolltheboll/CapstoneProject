import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [listings, setListings] = useState([]);
  const [messageInputs, setMessageInputs] = useState({});

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings/my-listings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setListings(res.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };

    const fetchInquiries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inquiries/landlord', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInquiries(res.data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      }
    };

    if (user?.role === 'landlord') {
      fetchListings();
      fetchInquiries();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
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

      const res = await axios.get('http://localhost:5000/api/inquiries/landlord', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Landlord Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="overflow-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
          {listings.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            <ul className="space-y-4">
              {listings.map((listing) => (
                <li key={listing._id} className="p-4 border rounded shadow bg-white bg-opacity-90">
                  <h3 className="text-lg font-bold">{listing.title}</h3>
                  <p>{listing.description}</p>
                  <p className="text-sm text-gray-600">Price: ${listing.price}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <Link to={`/edit-listing/${listing._id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(listing._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4">Inquiries Received</h2>
          {inquiries.length === 0 ? (
            <p>No inquiries received.</p>
          ) : (
            <ul className="space-y-4">
              {inquiries.map((inquiry) => (
                <li key={inquiry._id} className="p-4 border rounded shadow bg-white bg-opacity-90">
                  <p><strong>Listing:</strong> {inquiry.listing.title}</p>
                  <p><strong>Student:</strong> {inquiry.student.name} ({inquiry.student.email})</p>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border p-2 bg-gray-50 rounded">
                    {inquiry.messages.map((msg, idx) => (
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
                      value={messageInputs[inquiry._id] || ''}
                      onChange={(e) => handleMessageChange(inquiry._id, e.target.value)}
                    />
                    <button
                      onClick={() => handleSendMessage(inquiry._id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Send Message
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
