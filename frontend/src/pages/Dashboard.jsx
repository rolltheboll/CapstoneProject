
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inquiries/landlord', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInquiries(res.data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      }
    };

    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings/my-listings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setListings(res.data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };

    if (user?.role === 'landlord') {
      fetchInquiries();
      fetchListings();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Landlord Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <ul className="space-y-4">
            {listings.map((listing) => (
              <li key={listing._id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold">{listing.title}</h3>
                <p>{listing.description}</p>
                <p className="text-sm text-gray-600">Price: ${listing.price}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Inquiries Received</h2>
        {inquiries.length === 0 ? (
          <p>No inquiries received.</p>
        ) : (
          <ul className="space-y-4">
            {inquiries.map((inquiry) => (
              <li key={inquiry._id} className="p-4 border rounded shadow">
                <p><strong>Listing:</strong> {inquiry.listing.title}</p>
                <p><strong>Student:</strong> {inquiry.student.name} ({inquiry.student.email})</p>
                <p><strong>Message:</strong> {inquiry.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
