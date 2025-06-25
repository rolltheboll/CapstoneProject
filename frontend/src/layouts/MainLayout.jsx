import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const isTransparentRoute = (path) => {
  return (
    path === '/login' ||
    path === '/register' ||
    path === '/listings' ||
    path.startsWith('/profile')
  );
};

export default function MainLayout({ children }) {
  const location = useLocation();
  const transparent = isTransparentRoute(location.pathname);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/background.jpg")' }}
    >
      <Navbar />
      <main className="flex-grow p-6 flex justify-center">
        <div className={`w-full max-w-5xl ${!transparent ? 'bg-white bg-opacity-80 p-6 rounded-lg shadow-md' : ''}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
