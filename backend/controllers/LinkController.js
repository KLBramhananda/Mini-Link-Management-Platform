const Link = require("../models/Link");

exports.createLink = async (req, res) => {
  const { originalLink, remarks, expirationDate } = req.body;

  try {
    // Ensure originalLink has http:// or https://
    let formattedOriginalLink = originalLink;
    if (
      !originalLink.startsWith("http://") &&
      !originalLink.startsWith("https://")
    ) {
      formattedOriginalLink = "https://" + originalLink;
    }

    // Generate a random 6-8 character alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 10);

    // Use localhost:5000 instead of short.ly
    const shortLink = `http://localhost:5000/${randomString}`;

    const newLink = new Link({
      originalLink: formattedOriginalLink,
      shortLink, // This will now be http://localhost:5000/randomString
      remarks,
      expirationDate,
      clicks: 0,
    });

    await newLink.save();
    console.log("Created link:", newLink); // Debug log to verify the format
    res
      .status(201)
      .json({ message: "Link created successfully", link: newLink });
  } catch (error) {
    console.error("Link Creation Error:", error);
    res.status(500).json({ error: "Server error during link creation" });
  }
};

exports.handleLinkClick = async (req, res) => {
  try {
    const shortLink = `${req.protocol}://${req.get("host")}/${
      req.params.shortLink
    }`;
    const link = await Link.findOne({ shortLink });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Check if link is expired
    if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
      return res.status(410).json({ error: "Link has expired" });
    }

    // Increment clicks
    link.clicks += 1;
    await link.save();

    // Return the destination URL
    res.json({ destinationUrl: link.originalLink });
  } catch (error) {
    console.error("Link Click Error:", error);
    res.status(500).json({ error: "Server error processing link" });
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({});
    res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Server error fetching links" });
  }
};
