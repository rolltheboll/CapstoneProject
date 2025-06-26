import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.'
    );
    if (!confirmed) return;

    try {
      await axios.delete('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      logout();          
      navigate('/login'); 
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  if (!profile) return <p className="text-center text-black">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto py-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="space-y-3 bg-white bg-opacity-90 p-6 rounded shadow">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>

        <button
          onClick={handleDeleteAccount}
          className="mt-4 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-100 transition"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
