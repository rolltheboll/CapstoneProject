import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [housingType, setHousingType] = useState('');
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        const listing = res.data;
        setTitle(listing.title);
        setDescription(listing.description);
        setLocation(listing.location);
        setPrice(listing.price);
        setHousingType(listing.housingType);
        setImages(listing.images || []);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      }
    };

    fetchListing();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/listings/${id}`,
        { title, description, location, price, housingType, images },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update listing:', err);
    }
  };

  const handleUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dmmzudque',
        uploadPreset: 'stay4less',
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setImages((prev) => [...prev, result.info.secure_url]);
          setCurrentImage(images.length); 
        }
      }
    );
    widget.open();
  };

  const handleDeleteImage = () => {
    const newImages = images.filter((_, idx) => idx !== currentImage);
    setImages(newImages);
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-opacity-50 bg-cover bg-center" style={{ backgroundImage: 'url("/assets/background.jpg")' }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Edit Listing</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-black font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sunny Apartment near SFU"
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Cozy place close to university"
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Vancouver, BC"
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 1200"
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">Housing Type</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
            >
              <option value="">Select Housing Type</option>
              <option value="private">Private</option>
              <option value="shared">Shared</option>
              <option value="homestay">Homestay</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleUploadWidget}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Image
            </button>
          </div>

          {images.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={images[currentImage]}
                  alt={`Listing ${currentImage + 1}`}
                  className="h-48 rounded border mb-2"
                />
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  ◀
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleUpdate}
            className="w-full bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
          >
            Update Listing
          </button>
        </div>
      </div>
    </div>
  );
}
