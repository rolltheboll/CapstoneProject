import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import RoleHome from './pages/RoleHome';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Router>
      <MainLayout>
    <Routes>
       <Route path="/" element={<RoleHome />} />
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
       <Route path="/listings" element={<Listings />} />
       <Route path="/create-listing" element={<ProtectedRoute allowedRoles={['landlord']}><CreateListing /></ProtectedRoute>}/>
       <Route path="/edit-listing/:id" element={<EditListing />} />
       <Route path="/listings/:id" element={<ListingDetails />} />
       <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['landlord']}><Dashboard /></ProtectedRoute>} />
       <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}/>
       <Route path="/admin" element={ <ProtectedRoute allowedRoles="admin"><AdminPanel /></ProtectedRoute>} />
    </Routes>

      </MainLayout>
    </Router>
  );
  
}
console.log('App loaded')