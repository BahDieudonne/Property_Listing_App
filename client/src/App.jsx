import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import Navbar             from './components/Navbar';
import ProtectedRoute     from './components/ProtectedRoute';

// Page imports
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Profile       from './pages/Profile';
import MyListings    from './pages/MyListings';
import CreateListing from './pages/CreateListing';
import EditListing   from './pages/EditListing';

import './App.css'; 
function App() {
  return (
    <AuthProvider>
      {/* BrowserRouter enables client-side routing (URL changes without page reload) */}
      <BrowserRouter>
        {/* Navbar is outside Routes so it appears on every page */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public routes — accessible by anyone */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes — ProtectedRoute redirects to /login if not authenticated */}
            <Route path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route path="/my-listings"
              element={<ProtectedRoute><MyListings /></ProtectedRoute>}
            />
            <Route path="/listings/new"
              element={<ProtectedRoute><CreateListing /></ProtectedRoute>}
            />
            <Route path="/listings/edit/:id"
              element={<ProtectedRoute><EditListing /></ProtectedRoute>}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;