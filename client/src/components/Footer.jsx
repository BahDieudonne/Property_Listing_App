import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <span className="footer__logo">Prop<span>Space</span></span>
          <p className="footer__tagline">Find Your Perfect Space for Rent or Buy.</p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Browse</h4>
            <Link to="/">All Properties</Link>
            <Link to="/?listingType=rent">For Rent</Link>
            <Link to="/?listingType=sale">For Sale</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Get Started</Link>
            <Link to="/my-listings">My Listings</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Listing Types</h4>
            <Link to="/?type=Apartment">Apartments</Link>
            <Link to="/?type=House">Houses</Link>
            <Link to="/?type=Studio">Studios</Link>
          </div>
        </div>

      </div>

      <div className="footer__bottom">
        <p>&copy; {year} PropSpace. All rights reserved.</p>
        <p>Built by <strong>Bah Dieudonne</strong></p>
      </div>
    </footer>
  );
};

export default Footer;
