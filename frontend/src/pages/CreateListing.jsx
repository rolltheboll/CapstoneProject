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
    housingType: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_upload_preset'); 
      const res = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData); 
      return res.data.secure_url;
    });

    try {
      setUploading(true);
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/listings', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create listing:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white bg-opacity-90 p-6 rounded shadow">
        <input name="title" placeholder="Title" className="p-2 border rounded w-full" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="p-2 border rounded w-full" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" className="p-2 border rounded w-full" onChange={handleChange} required />
        <input name="location" placeholder="Location" className="p-2 border rounded w-full" onChange={handleChange} required />
        <select name="housingType" className="p-2 border rounded w-full" onChange={handleChange} required>
          <option value="">Select Housing Type</option>
          <option value="shared">Shared</option>
          <option value="private">Private</option>
          <option value="homestay">Homestay</option>
        </select>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full" />
        {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
        <div className="grid grid-cols-3 gap-2">
          {formData.images.map((url, i) => (
            <img key={i} src={url} alt="Preview" className="h-24 w-full object-cover rounded" />
          ))}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Listing</button>
      </form>
    </div>
  );
}
