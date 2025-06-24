import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inquiries/mine', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setInquiries(res.data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      }
    };

    if (user?.role === 'student') {
      fetchInquiries();
    }
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto py-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <h2 className="text-lg mb-2">Your Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {inquiries.map((inq) => (
            <li key={inq._id} className="p-4 border rounded shadow">
              <p><strong>Listing:</strong> {inq.listing.title}</p>
              <p><strong>Message:</strong> {inq.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
