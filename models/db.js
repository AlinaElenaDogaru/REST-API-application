const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error('❌ Database connection error:', error));
db.once('open', () => console.log('✅ Database connection successful'));

module.exports = db;
