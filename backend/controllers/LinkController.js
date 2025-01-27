const Link = require('../models/Link');

exports.createLink = async (req, res) => {
  const { originalLink, shortLink, remarks, expirationDate } = req.body;

  try {
    const newLink = new Link({
      originalLink,
      shortLink,
      remarks,
      expirationDate
    });

    await newLink.save();
    res.status(201).json({ message: 'Link created successfully', link: newLink });
  } catch (error) {
    console.error('Link Creation Error:', error);
    res.status(500).json({ error: 'Server error during link creation' });
  }
};
