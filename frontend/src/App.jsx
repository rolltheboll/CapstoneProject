import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Router>
      <MainLayout>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/listings" element={<Listings />} />
       <Route path="/listings/:id" element={<ListingDetails />} />
       <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student', 'landlord']}><Dashboard /></ProtectedRoute>} />
       <Route path="/admin" element={ <ProtectedRoute allowedRoles="admin"><AdminPanel /></ProtectedRoute>} />
    </Routes>

      </MainLayout>
    </Router>
  );
  
}
console.log('App loaded')