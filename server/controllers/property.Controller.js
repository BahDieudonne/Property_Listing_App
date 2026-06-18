const repo = require('../repositories/propertyRepository');

// Builds the full URL for an uploaded file so it can be stored and served directly
const fileUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, type, listingType } = req.query;
    const properties = await repo.getAllProperties({ city, minPrice, maxPrice, type, listingType });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching properties' });
  }
};

// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await repo.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (err) {
    res.status(400).json({ message: 'Invalid property ID' });
  }
};

// GET /api/properties/my-listings
const getMyListings = async (req, res) => {
  try {
    const properties = await repo.getPropertiesByAuthor(req.user._id);
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching your listings' });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { title, description, price, city, country, type, listingType } = req.body;

    if (!title || !description || !price || !city || !country || !type || !listingType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const imageUrls = req.files?.length
      ? req.files.map(f => fileUrl(req, f.filename))
      : [];

    const property = await repo.createProperty({
      title,
      description,
      price:  Number(price),
      city,
      country,
      type,
      listingType,
      imageUrls,
      author: req.user._id,
    });

    res.status(201).json(property);
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ message: 'Server error creating property' });
  }
};

// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const { title, description, price, city, country, type, listingType, existingImages } = req.body;

    let imageUrls;
    if (req.files?.length) {
      imageUrls = req.files.map(f => fileUrl(req, f.filename));
    } else {
      imageUrls = existingImages ? JSON.parse(existingImages) : [];
    }

    const updated = await repo.updateProperty(req.params.id, {
      title,
      description,
      price: Number(price),
      city,
      country,
      type,
      listingType,
      imageUrls,
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating property' });
  }
};

// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    await repo.deleteProperty(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting property' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyListings,
  createProperty,
  updateProperty,
  deleteProperty,
};
