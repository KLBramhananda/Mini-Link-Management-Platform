const express = require('express');

const router = express.Router();

// Example route for sharing a link
router.post('/share', (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'Link is required' });
  }
  // Logic to handle the link sharing
  res.status(200).json({ message: 'Link shared successfully', link });
});

module.exports = router;