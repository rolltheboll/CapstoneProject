import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: 'url(\"/assets/background.jpg\")' }}
    >
      <Navbar />

      {}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <main className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded shadow-lg">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
