import { useState, useEffect } from 'react';
import { useParams, Link }    from 'react-router-dom';
import axiosInstance          from '../services/axiosInstance';
import LoadingSpinner         from '../components/LoadingSpinner';
import { resolveImageUrl, fallbackImageUrl } from '../services/imageUrl';

const PropertyDetail = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    axiosInstance.get(`/properties/${id}`, { signal: controller.signal })
      .then(({ data }) => { if (mounted) setProperty(data); })
      .catch(err => { if (mounted && err.name !== 'CanceledError') setError('Property not found.'); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; controller.abort(); };
  }, [id]);

  if (loading || !property) return <LoadingSpinner />;

  if (error) return (
    <div className="page-container">
      <div className="alert alert--error">{error}</div>
      <Link to="/" className="btn btn--outline" style={{ marginTop: '1rem' }}>
        ← Back to listings
      </Link>
    </div>
  );

  const { title, description, price, city, country, type, listingType, imageUrls, author } = property;

  const imgSrc = imageUrls?.[0]
    ? resolveImageUrl(imageUrls[0])
    : fallbackImageUrl(type || 'Property', 800, 420);

  const authorName   = author?.name || author?.username || 'Unknown';
  const authorInitial = authorName[0].toUpperCase();

  return (
    <div className="detail-page">
      {/* ===== HERO IMAGE ===== */}
      <div className="detail-hero">
        <img
          src={imgSrc}
          alt={title}
          className="detail-hero__img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImageUrl(type || 'Property', 800, 420);
          }}
        />
        <span className="detail-hero__badge">{type}</span>
        <span className={`detail-hero__listing-badge detail-hero__listing-badge--${listingType}`}>
          {listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      {/* ===== BODY ===== */}
      <div className="detail-body">

        {/* Title + price row */}
        <div className="detail-header">
          <div>
            <h1 className="detail-title">{title}</h1>
            <p className="detail-location">{city}, {country}</p>
          </div>
          <div className="detail-price">
            {price.toLocaleString('fr-FR')} FCFA
            {listingType === 'rent' && <span>/month</span>}
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h3 className="detail-section__label">About this property</h3>
          <p className="detail-section__text">{description}</p>
        </div>

        {/* Host */}
        {author && (
          <div className="detail-section detail-host">
            <h3 className="detail-section__label">Listed by</h3>
            <div className="detail-host__row">
              {author.avatar
                ? <img src={author.avatar} alt={authorName} className="detail-host__avatar" />
                : <div className="detail-host__avatar detail-host__avatar--placeholder">{authorInitial}</div>
              }
              <span className="detail-host__name">{authorName}</span>
            </div>
          </div>
        )}

        <Link to="/" className="btn btn--outline" style={{ marginTop: '1.5rem' }}>
          ← Back to listings
        </Link>
      </div>
    </div>
  );
};

export default PropertyDetail;
