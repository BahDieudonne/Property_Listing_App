import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance  from '../services/axiosInstance';
import InputField     from '../components/InputField';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: '',
  });
  const [images,      setImages]      = useState([]);   // File objects
  const [previews,    setPreviews]    = useState([]);   // Object URLs
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);

  const fileInputRef = useRef(null);
  const navigate     = useNavigate();

  // Revoke object URLs when component unmounts to free memory
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const validate = () => {
    const errs = {};
    if (!form.title)       errs.title       = 'Title is required';
    if (!form.description) errs.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 50000)
                           errs.price       = 'Price must be at least 50,000 FCFA';
    if (!form.city)        errs.city        = 'City is required';
    if (!form.country)     errs.country     = 'Country is required';
    if (!form.type)        errs.type        = 'Property type is required';
    if (images.length === 0) errs.images    = 'At least one image is required';
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Revoke previous previews before creating new ones
    previews.forEach(url => URL.revokeObjectURL(url));

    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev  => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title',       form.title);
      formData.append('description', form.description);
      formData.append('price',       form.price);
      formData.append('city',        form.city);
      formData.append('country',     form.country);
      formData.append('type',        form.type);
      images.forEach(file => formData.append('images', file));

      await axiosInstance.post('/properties', formData);
      navigate('/my-listings');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Create a New Listing</h2>

      {serverError && <div className="alert alert--error">{serverError}</div>}

      <form onSubmit={handleSubmit} className="listing-form" noValidate>
        <InputField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
        />

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`input-field ${errors.description ? 'input-error' : ''}`}
            rows={4}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <InputField
            label="Price (FCFA/month)"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
          />
          <div className="input-group">
            <label className="input-label">Property Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`input-field ${errors.type ? 'input-error' : ''}`}
            >
              <option value="">-- Select Type --</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>
        </div>

        <div className="form-row">
          <InputField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
          />
          <InputField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            error={errors.country}
          />
        </div>

        {/* ===== IMAGE UPLOAD ===== */}
        <div className="input-group">
          <label className="input-label">Property Images</label>

          <div
            className={`upload-zone ${errors.images ? 'upload-zone--error' : ''}`}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="upload-zone__text">Click to select images</p>
            <p className="upload-zone__hint">JPEG, PNG or WebP · max 5 MB each</p>
          </div>
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="upload-previews">
            {previews.map((src, i) => (
              <div key={i} className="upload-preview">
                <img src={src} alt={`preview ${i + 1}`} />
                <button
                  type="button"
                  className="upload-preview__remove"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
