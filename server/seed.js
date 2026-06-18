const dotenv   = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User     = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

const properties = [
  {
    title:       'Modern City Apartment',
    description: 'A sleek, fully furnished apartment in the heart of the city. Walking distance to restaurants, shops, and public transport.',
    price:       85000,
    city:        'Douala',
    country:     'Cameroon',
    type:        'Apartment',
    listingType: 'rent',
    imageUrls:   ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    title:       'Cozy Suburban House',
    description: 'Spacious family home with a large garden, quiet street, and excellent schools nearby. Perfect for families.',
    price:       95000,
    city:        'Yaoundé',
    country:     'Cameroon',
    type:        'House',
    listingType: 'sale',
    imageUrls:   ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
  },
  {
    title:       'Beachfront Studio',
    description: 'Wake up to ocean views every morning. Compact, stylish studio just steps from the beach.',
    price:       75000,
    city:        'Kribi',
    country:     'Cameroon',
    type:        'Studio',
    listingType: 'rent',
    imageUrls:   ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80'],
  },
  {
    title:       'Luxury Penthouse',
    description: 'Top-floor penthouse with panoramic skyline views, rooftop terrace, and premium finishes throughout.',
    price:       100000,
    city:        'Douala',
    country:     'Cameroon',
    type:        'Apartment',
    listingType: 'sale',
    imageUrls:   ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
  },
  {
    title:       'Charming Countryside Cottage',
    description: 'A peaceful retreat surrounded by nature. Ideal for remote workers or anyone seeking a quiet escape.',
    price:       60000,
    city:        'Bafoussam',
    country:     'Cameroon',
    type:        'House',
    listingType: 'sale',
    imageUrls:   ['https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80'],
  },
  {
    title:       'Downtown Loft Studio',
    description: 'Industrial-chic open-plan studio in a converted warehouse. High ceilings, exposed brick, and great natural light.',
    price:       85000,
    city:        'Buea',
    country:     'Cameroon',
    type:        'Studio',
    listingType: 'rent',
    imageUrls:   ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  },
  {
    title:       'Lakeside Family Home',
    description: 'Beautiful home on the lake with a private dock, open-plan kitchen, and stunning sunset views from the deck.',
    price:       90000,
    city:        'Limbe',
    country:     'Cameroon',
    type:        'House',
    listingType: 'rent',
    imageUrls:   ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80'],
  },
  {
    title:       'Historic City Apartment',
    description: 'Charming apartment in a listed building with original features, high ceilings, and a prime central location.',
    price:       80000,
    city:        'Ngaoundéré',
    country:     'Cameroon',
    type:        'Apartment',
    listingType: 'sale',
    imageUrls:   ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
  },
  {
    title:       'Modern Garden Studio',
    description: 'Light-filled studio with private garden access, fully equipped kitchen, and fast Wi-Fi. Great for professionals.',
    price:       55000,
    city:        'Bamenda',
    country:     'Cameroon',
    type:        'Studio',
    listingType: 'rent',
    imageUrls:   ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80'],
  },
];

const seed = async () => {
  await connectDB();

  // Remove any existing seed data
  await Property.deleteMany({});
  await User.deleteMany({ email: 'demo@propspace.com' });

  // Create a demo owner account that all seeded listings belong to
  const owner = await User.create({
    username: 'demoowner',
    email:    'demo@propspace.com',
    password: 'password123',
    name:     'Demo Owner',
  });

  const docs = properties.map(p => ({ ...p, author: owner._id }));
  await Property.insertMany(docs);

  console.log(`Seeded ${docs.length} properties for user: ${owner.email}`);
  console.log('Login with  demo@propspace.com / password123  to manage them.');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
