import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveImageUrl, fallbackImageUrl } from '../services/imageUrl';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadListing = async () => {
      try {
        const { data } = await axiosInstance.get(`/properties/${id}`, {
          signal: controller.signal,
        });

        if (!mounted) return;

        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          city: data.city || '',
          country: data.country || '',
          type: data.type || '',
          listingType: data.listingType || 'rent',
        });
        setExistingImgs(data.imageUrls || []);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setServerError('Failed to load listing details.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadListing();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const validate = () => {
    const errs = {};

    if (!form.title) errs.title = 'Title is required';
    if (!form.description) errs.description = 'Description is required';
    if (!form.price || Number(form.price) < 50000)
      errs.price = 'Price must be at least 50,000 FCFA';
    if (!form.city) errs.city = 'City is required';
    if (!form.country) errs.country = 'Country is required';
    if (!form.type) errs.type = 'Property type is required';
    if (!form.listingType) errs.listingType = 'Please select For Rent or For Sale';
    if (existingImgs.length === 0 && newImages.length === 0)
      errs.images = 'At least one image is required';

    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    previews.forEach(url => URL.revokeObjectURL(url));
    setNewImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeExistingImage = (index) => {
    setExistingImgs(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSaving(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('city', form.city);
      formData.append('country', form.country);
      formData.append('type', form.type);
      formData.append('listingType', form.listingType);

      if (newImages.length) {
        newImages.forEach(file => formData.append('images', file));
      } else {
        formData.append('existingImages', JSON.stringify(existingImgs));
      }

      await axiosInstance.put(`/properties/${id}`, formData);
      navigate('/my-listings');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  return (
    <div className="form-page">
      <h2>Edit Listing</h2>
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
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Listing Purpose</label>
          <div className="listing-type-toggle">
            {['rent', 'sale'].map(opt => (
              <label key={opt} className={`listing-type-option${form.listingType === opt ? ' listing-type-option--active' : ''}`}>
                <input
                  type="radio"
                  name="listingType"
                  value={opt}
                  checked={form.listingType === opt}
                  onChange={handleChange}
                />
                {opt === 'rent' ? 'For Rent' : 'For Sale'}
              </label>
            ))}
          </div>
          {errors.listingType && <span className="error-text">{errors.listingType}</span>}
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

        {existingImgs.length > 0 && newImages.length === 0 && (
          <div className="input-group">
            <label className="input-label">Current Images</label>
            <div className="upload-previews">
              {existingImgs.map((src, i) => (
                <div key={i} className="upload-preview">
                  <img
                    src={resolveImageUrl(src)}
                    alt={`image ${i + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImageUrl('Property', 400, 250);
                    }}
                  />
                  <button
                    type="button"
                    className="upload-preview__remove"
                    onClick={() => removeExistingImage(i)}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">
            {newImages.length ? 'New Images (will replace current)' : 'Replace Images'}
          </label>
          <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
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
            <p className="upload-zone__text">Click to select new images</p>
            <p className="upload-zone__hint">JPEG, PNG or WebP · max 5 MB each</p>
          </div>
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {previews.length > 0 && (
          <div className="upload-previews">
            {previews.map((src, i) => (
              <div key={i} className="upload-preview">
                <img src={src} alt={`new preview ${i + 1}`} />
                <button
                  type="button"
                  className="upload-preview__remove"
                  onClick={() => removeNewImage(i)}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditListing;
