import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '../hooks/useAuth';

mapboxgl.accessToken =
  'pk.eyJ1Ijoicm9mbGxtYW8iLCJhIjoiY21icm90M2dpMGV1NjJrb2h4Y3dlaWpnMSJ9.-bnR3KFZU21AO3qSC7hgoA';

export default function ListingDetails() {
  const { id } = useParams();
  const mapContainerRef = useRef(null);
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(res.data);
        if (user) {
          const existing = res.data.find((r) =>
            typeof r.student === 'string'
              ? r.student === user._id
              : r.student._id === user._id
          );
          if (existing) setReviewed(true);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    fetchListing();
    fetchReviews();
  }, [id, user]);

  useEffect(() => {
    if (listing?.coordinates) {
      const { lat, lng } = listing.coordinates;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 12,
      });

      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      setTimeout(() => map.resize(), 200);
      return () => map.remove();
    }
  }, [listing]);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        { listing: id, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReviewed(true);
      setComment('');
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setReviewed(false);
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleReport = async () => {
    if (!window.confirm('Are you sure you want to report this listing?')) return;
    try {
      await axios.post(
        'http://localhost:5000/api/reports',
        { listingId: id, reason: 'Inappropriate or misleading listing.' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Listing has been reported. Thank you for your feedback.');
    } catch (err) {
      console.error('Failed to report listing:', err);
      alert('There was an error reporting this listing.');
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-black bg-white bg-opacity-90 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <p className="text-gray-600 mb-2">{listing.location}</p>
      <p className="text-blue-600 text-lg font-semibold mb-2">${listing.price}</p>
      <p className="text-sm mb-4 capitalize">{listing.housingType}</p>
      <p className="mb-6">{listing.description}</p>

      {listing.images?.length > 0 && (
        <div className="mb-6">
          <img
            src={listing.images[currentImageIndex]}
            alt={`Listing ${currentImageIndex + 1}`}
            className="w-full max-h-96 object-cover rounded mb-2"
          />
          {listing.images.length > 1 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : listing.images.length - 1
                  )
                }
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                ◀ Prev
              </button>
              <span className="self-center text-sm text-gray-600">
                {currentImageIndex + 1} / {listing.images.length}
              </span>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev < listing.images.length - 1 ? prev + 1 : 0
                  )
                }
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {listing.coordinates && (
        <div className="mb-6 rounded overflow-hidden border">
          <div
            ref={mapContainerRef}
            className="h-64 w-full"
            style={{ minHeight: '256px' }}
          />
        </div>
      )}

      {user?.role === 'student' && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Send Inquiry</h2>
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
          <button
            onClick={handleReport}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚩 Report Listing
          </button>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => {
              const reviewAuthorId =
                typeof review.student === 'object'
                  ? review.student._id
                  : review.student;
              const isAuthor = user && reviewAuthorId === user._id;

              return (
                <li key={review._id} className="border p-4 rounded bg-white shadow">
                  <p className="font-semibold">{review.student?.name || 'Anonymous'}</p>
                  <p className="text-yellow-600">Rating: {review.rating}/5</p>
                  <p>{review.comment}</p>
                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 text-sm hover:underline mt-2"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {user?.role === 'student' && !reviewed && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
