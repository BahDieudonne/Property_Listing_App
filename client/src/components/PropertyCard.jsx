import { Link } from 'react-router-dom';
import { resolveImageUrl, fallbackImageUrl } from '../services/imageUrl';

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7v10M21 7v10M3 12h18M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const PropertyCard = ({ property, onDelete, isOwner }) => {
  const { _id, title, description, city, country, price, type, listingType, imageUrls } = property;

  const imgSrc = imageUrls?.[0]
    ? resolveImageUrl(imageUrls[0])
    : fallbackImageUrl(type || 'Property', 400, 250);

  return (
    <div className="property-card">
      {/* Clicking the image navigates to the detail page */}
      <Link to={`/listings/${_id}`} className="property-card__img-wrap">
        <img
          src={imgSrc}
          alt={title}
          className="property-card__image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImageUrl(type || 'Property', 400, 250);
          }}
        />
        <span className="property-card__badge">{type}</span>
        <span className={`property-card__listing-badge property-card__listing-badge--${listingType}`}>
          {listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </Link>

      <div className="property-card__body">
        <Link to={`/listings/${_id}`} className="property-card__title-link">
          <h3 className="property-card__title">{title}</h3>
        </Link>

        <p className="property-card__desc">{description}</p>

        <div className="property-card__meta">
          <span className="property-card__meta-item"><BedIcon /> {city}</span>
          <span className="property-card__meta-item"><UserIcon /> {country}</span>
        </div>

        <div className="property-card__footer">
          <span className="property-card__price">
            {price.toLocaleString('fr-FR')} FCFA
            {listingType === 'rent' && <span>/month</span>}
          </span>
          <span className="property-card__rating">
            <span className="property-card__star">★</span>
            {(4.5 + (parseInt(_id.slice(-1), 16) % 6) * 0.1).toFixed(1)}
          </span>
        </div>

        {/* Actions row — View Details always visible; Edit/Delete only for owner */}
        <div className="property-card__actions">
          <Link to={`/listings/${_id}`} className="btn btn--outline btn--sm">
            View Details
          </Link>
          {isOwner && (
            <>
              <Link to={`/listings/edit/${_id}`} className="btn btn--outline btn--sm">
                Edit
              </Link>
              <button onClick={() => onDelete(_id)} className="btn btn--danger btn--sm">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
