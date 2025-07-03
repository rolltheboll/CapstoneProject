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
      description: (
        <>
          <p>
            As a student, you can explore listings, send inquiries to landlords, and leave reviews for accommodations.
          </p>
          <div className="mt-4 text-left text-sm text-gray-700 bg-yellow-100 p-4 rounded shadow-sm">
            <p className="font-bold mb-2">PLEASE READ BEFORE STARTING YOUR SEARCH:</p>
            <ul className="list-disc list-inside space-y-3 text-base sm:text-[17px]">
              <li>Try to communicate and make agreements through Stay4less.</li>
              <li>Never send money in advance or before confirming details.</li>
              <li>Check reviews and listing details carefully. If it is too good to be true, it probably is.</li>
              <li>Report any suspicious listings or messages. Our admin is here to help.</li>
            </ul>
          </div>
        </>
      ),
      image: '/assets/student.jpg',
      actions: [
        { label: 'Browse Listings', path: '/listings' },
        { label: 'View Your Dashboard', path: '/student-dashboard' },
      ],
    },
    landlord: {
      title: 'Welcome to Stay4less!',
      description: (
        <>
          <p>
            As a landlord, you can create listings, manage your properties, and respond to student inquiries.
          </p>
          <div className="mt-4 text-left text-sm text-gray-700 bg-blue-100 p-4 rounded shadow-sm">
            <p className="font-semibold mb-2"> Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 text-base sm:text-[17px]">
              <li>Ensure your listings are accurate and up to date to avoid misunderstandings.</li>
              <li>Respond promptly to student inquiries to build trust and increase engagement.</li>
              <li>Use clear, high-quality images to showcase your property.</li>
              <li>Avoid sharing personal contact information outside the platform.</li>
              <li>If you receive suspicious inquiries, report them to the admin team.</li>
            </ul>
          </div>
        </>
      ),
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
