import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const roleContent = {
    student: {
      title: 'Welcome to Stay4less!',
      description:
        'As a student, you can explore listings, send inquiries to landlords, and leave reviews for accommodations.',
      image: '/assets/student.jpg',
      actions: [
        { label: 'Browse Listings', path: '/listings' },
        { label: 'View Your Dashboard', path: '/student-dashboard' },
      ],
    },
    landlord: {
      title: 'Welcome to Stay4less!',
      description:
        'As a landlord, you can create listings, manage your properties, and respond to student inquiries.',
      image: '/assets/landlord.jpg',
      actions: [
        { label: 'Manage Listings', path: '/dashboard' },
        { label: 'Create New Listing', path: '/create-listing' },
      ],
    },
    admin: {
      title: 'Welcome LORD!',
      description:
        'As an admin, you have full access to manage users and listings across the platform.',
      image: '/assets/admin.jpeg',
      actions: [{ label: 'Access Admin Panel', path: '/admin' }],
    },
  };

  const { title, description, actions, image } = roleContent[user.role] || {
    title: 'Welcome!',
    description: 'Your role does not have a specific dashboard view yet.',
    actions: [],
    image: null,
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-black text-center">
      {image && (
        <img
          src={image}
          alt={`${user.role} dashboard`}
          className="mx-auto mb-6 rounded shadow-md max-h-64 object-cover"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="mb-6">{description}</p>

      <div className="space-y-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
