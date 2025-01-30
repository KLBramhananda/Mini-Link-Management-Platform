const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const linkRoutes = require('./routes/LinkRoutes');
const Link = require('./models/Link'); // Import the Link model
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection ERROR:', err);
  // Print full connection details
  console.log('Connection URI:', process.env.MONGO_URI);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// User routes
app.use('/api/users', userRoutes);

// Link routes
app.use('/api/links', linkRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Handle short URL redirection
app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = `https://short.ly/${req.params.shortUrl}`;
    const link = await Link.findOne({ shortLink: shortUrl });
    if (!link) {
      return res.status(404).send('<script>alert("Sorry, link is expired, try another link!"); window.location.href = "/";</script>');
    }
    if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
      return res.status(410).send('<script>alert("Sorry, link is expired, try another link!"); window.location.href = "/";</script>');
    }
    res.redirect(link.originalLink);
  } catch (error) {
    console.error('Redirection Error:', error);
    res.status(500).send('Server error during redirection');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// In your main server file (app.js or server.js)
app.use((error, req, res, next) => {
  console.error('Server Error:', {
    message: error.message,
    stack: error.stack
  });
  res.status(500).json({ error: 'Server processing error' });
});

// Add global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});