import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    housingType: 'private',
    images: []
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dmmzudque',
        uploadPreset: 'stay4less'
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, result.info.secure_url]
          }));
          setCurrentImageIndex(formData.images.length);
        }
      }
    );
    widget.open();
  };

  const handleDeleteImage = () => {
    if (formData.images.length === 0) return;

    const updatedImages = formData.images.filter((_, index) => index !== currentImageIndex);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < formData.images.length - 1 ? prev + 1 : prev
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/listings',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Listing creation failed:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="housingType"
          value={formData.housingType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="private">Private</option>
          <option value="shared">Shared</option>
          <option value="homestay">Homestay</option>
        </select>

        
        <div className="flex justify-center gap-6 mt-4">
          <button
            type="button"
            onClick={handleUploadWidget}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Upload Image
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Listing
          </button>
        </div>

        {formData.images.length > 0 && (
          <div className="flex flex-col items-center mt-6">
            <img
              src={formData.images[currentImageIndex]}
              alt="Uploaded"
              className="h-40 object-cover rounded mb-2"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
                className="bg-gray-700 text-white px-4 py-1 rounded disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                disabled={currentImageIndex === formData.images.length - 1}
                className="bg-gray-700 text-white px-4 py-1 rounded disabled:opacity-50"
              >
                Next ▶
              </button>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
