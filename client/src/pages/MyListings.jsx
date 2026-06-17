import { useState, useEffect } from 'react';
import { Link }       from 'react-router-dom';
import axiosInstance  from '../services/axiosInstance';
import PropertyCard   from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // Fetch on mount; abort the request if the component unmounts before it resolves
  useEffect(() => {
    const controller = new AbortController();

    axiosInstance.get('/properties/my-listings', { signal: controller.signal })
      .then(({ data }) => setListings(data))
      .catch(err => {
        if (err.name !== 'CanceledError') setError('Failed to load your listings.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await axiosInstance.delete(`/properties/${id}`);
      setListings(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete listing.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Listings</h2>
        <Link to="/listings/new" className="btn btn--primary">+ New Listing</Link>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {!error && listings.length === 0 && (
        <div className="empty-state">
          You haven't listed any properties yet.{' '}
          <Link to="/listings/new">Create one</Link>.
        </div>
      )}

      <div className="properties-grid">
        {listings.map(p => (
          <PropertyCard
            key={p._id}
            property={p}
            isOwner
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyListings;
