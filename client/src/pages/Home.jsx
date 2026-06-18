import { useState, useEffect, useCallback } from 'react';
import axiosInstance  from '../services/axiosInstance';
import PropertyCard   from '../components/PropertyCard';
import FilterSidebar  from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const HERO_BG   = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';
const TYPE_TABS = ['All Stays', 'Apartment', 'House', 'Studio'];

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
    <line x1="4" y1="6"  x2="20" y2="6"  />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const Home = () => {
  const [properties,   setProperties]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [activeTab,    setActiveTab]    = useState('All Stays');
  const [showFilters,  setShowFilters]  = useState(false);

  const fetchProperties = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/properties', {
        params: filters,
      });
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'All Stays') fetchProperties();
    else fetchProperties({ type: tab });
  };

  const displayed = activeTab === 'All Stays'
    ? properties
    : properties.filter(p => p.type === activeTab);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <div className="hero">
        <img src={HERO_BG} alt="scenic landscape" className="hero__bg" />
        <div className="hero__content">
          <h1 className="hero__title">Peace, nature,<br />dream</h1>
          <p className="hero__subtitle">Find and book a great property experience.</p>

          <div className="filter-bar">
            {TYPE_TABS.map((tab, i) => (
              <span key={tab}>
                {i === TYPE_TABS.length - 2 && <span className="filter-divider" />}
                <button
                  className={`filter-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="home-layout">
        <div>
          <button
            className={`filter-toggle-btn${showFilters ? ' filter-toggle-btn--active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
          >
            <FilterIcon />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <FilterSidebar
            onFilter={fetchProperties}
            className={showFilters ? '' : 'filter-sidebar--hidden'}
          />
        </div>

        <section>
          <div className="section-header">
            <span className="section-title">
              {displayed.length > 0 ? `Over ${displayed.length} stays` : 'Properties'}
            </span>
          </div>

          {loading && <LoadingSpinner />}
          {error   && <div className="alert alert--error">{error}</div>}

          {!loading && !error && displayed.length === 0 && (
            <div className="empty-state">No properties found. Try adjusting your filters.</div>
          )}

          <div className="properties-grid">
            {displayed.map(p => (
              <PropertyCard key={p._id} property={p} isOwner={false} />
            ))}
          </div>
        </section>
      </div>  {/* home-layout */}
    </div>
  );
};

export default Home;
