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
    price:       150000,
    city:        'Douala',
    country:     'Cameroon',
    type:        'Apartment',
    imageUrls:   ['home1.jpg'],
  },
  {
    title:       'Cozy Suburban House',
    description: 'Spacious family home with a large garden, quiet street, and excellent schools nearby. Perfect for families.',
    price:       250000,
    city:        'Yaoundé',
    country:     'Cameroon',
    type:        'House',
    imageUrls:   ['home2.jpg'],
  },
  {
    title:       'Beachfront Studio',
    description: 'Wake up to ocean views every morning. Compact, stylish studio just steps from the beach.',
    price:       75000,
    city:        'Kribi',
    country:     'Cameroon',
    type:        'Studio',
    imageUrls:   ['home3.jpg'],
  },
  {
    title:       'Luxury Penthouse',
    description: 'Top-floor penthouse with panoramic skyline views, rooftop terrace, and premium finishes throughout.',
    price:       500000,
    city:        'Douala',
    country:     'Cameroon',
    type:        'Apartment',
    imageUrls:   ['home4.jpg'],
  },
  {
    title:       'Charming Countryside Cottage',
    description: 'A peaceful retreat surrounded by nature. Ideal for remote workers or anyone seeking a quiet escape.',
    price:       60000,
    city:        'Bafoussam',
    country:     'Cameroon',
    type:        'House',
    imageUrls:   ['home5.jpg'],
  },
  {
    title:       'Downtown Loft Studio',
    description: 'Industrial-chic open-plan studio in a converted warehouse. High ceilings, exposed brick, and great natural light.',
    price:       85000,
    city:        'Buea',
    country:     'Cameroon',
    type:        'Studio',
    imageUrls:   ['home6.jpg'],
  },
  {
    title:       'Lakeside Family Home',
    description: 'Beautiful home on the lake with a private dock, open-plan kitchen, and stunning sunset views from the deck.',
    price:       320000,
    city:        'Limbe',
    country:     'Cameroon',
    type:        'House',
    imageUrls:   ['home7.jpg'],
  },
  {
    title:       'Historic City Apartment',
    description: 'Charming apartment in a listed building with original features, high ceilings, and a prime central location.',
    price:       180000,
    city:        'Ngaoundéré',
    country:     'Cameroon',
    type:        'Apartment',
    imageUrls:   ['home8.jpg'],
  },
  {
    title:       'Modern Garden Studio',
    description: 'Light-filled studio with private garden access, fully equipped kitchen, and fast Wi-Fi. Great for professionals.',
    price:       55000,
    city:        'Bamenda',
    country:     'Cameroon',
    type:        'Studio',
    imageUrls:   ['home9.jpg'],
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
