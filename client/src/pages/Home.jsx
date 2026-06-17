import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance  from '../services/axiosInstance';
import PropertyCard   from '../components/PropertyCard';
import FilterSidebar  from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const HERO_BG   = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';
const TYPE_TABS = ['All Stays', 'Apartment', 'House', 'Studio'];

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [activeTab,  setActiveTab]  = useState('All Stays');

  // Holds the AbortController for the currently in-flight request
  const abortCtrl = useRef(null);

  // Cancels any previous request before starting a new one
  const fetchProperties = useCallback(async (filters = {}) => {
    if (abortCtrl.current) abortCtrl.current.abort();
    const controller = new AbortController();
    abortCtrl.current = controller;

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.city)     params.append('city',     filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const { data } = await axiosInstance.get(`/properties?${params.toString()}`, {
        signal: controller.signal,
      });
      setProperties(data);
    } catch (err) {
      if (err.name !== 'CanceledError') setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once on mount; abort in-flight request if component unmounts
  useEffect(() => {
    fetchProperties();
    return () => { if (abortCtrl.current) abortCtrl.current.abort(); };
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
        <FilterSidebar onFilter={fetchProperties} />

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
      </div>
    </div>
  );
};

export default Home;
