import { useState } from 'react';
import InputField from './InputField';

// Sidebar panel for filtering properties by city and price range
// Props:
//   onFilter — function from Home.jsx that triggers a new API fetch with given filters
const FilterSidebar = ({ onFilter, className = '' }) => {
  const [city,        setCity]        = useState('');
  const [minPrice,    setMinPrice]    = useState('');
  const [maxPrice,    setMaxPrice]    = useState('');
  const [listingType, setListingType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ city, minPrice, maxPrice, listingType });
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setListingType('');
    onFilter({});
  };

  return (
    <aside className={`filter-sidebar${className ? ` ${className}` : ''}`}>
      <h3>Filters</h3>
      <form onSubmit={handleSubmit}>
        <InputField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Buea, Douala"
        />
        <div className="input-group">
          <label className="input-label">Listing Type</label>
          <select
            className="input-field"
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
          >
            <option value="">All</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>

        <InputField
          label="Min Price (FCFA)"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="50 000"
        />
        <InputField
          label="Max Price (FCFA)"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="No limit"
        />
        <button
          type="submit"
          className="btn btn--primary"
          style={{ width: '100%', marginTop: '0.25rem' }}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn--ghost"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Clear filters
        </button>
      </form>
    </aside>
  );
};

export default FilterSidebar;