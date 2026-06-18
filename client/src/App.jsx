import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthProvider';
import Navbar             from './components/Navbar';
import Footer             from './components/Footer';
import ProtectedRoute     from './components/ProtectedRoute';

// Page imports
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Profile       from './pages/Profile';
import MyListings    from './pages/MyListings';
import CreateListing from './pages/CreateListing';
import EditListing      from './pages/EditListing';
import PropertyDetail  from './pages/PropertyDetail';

import './App.css'; 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

            {/* Public property detail view */}
            <Route path="/listings/:id" element={<PropertyDetail />} />

            {/* 404 — catch all unmatched paths */}
            <Route path="*" element={
              <div className="empty-state" style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>404 — Page not found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;