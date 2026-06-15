import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // logout() now calls the server to clear the HTTP-only cookie
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">Prop<span>Space</span></Link>
      <div className="navbar__links">
        <Link to="/">Browse</Link>
        {user ? (
          <>
            <Link to="/listings/new">List Property</Link>
            <Link to="/my-listings">My Listings</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn btn--outline btn--sm">Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;