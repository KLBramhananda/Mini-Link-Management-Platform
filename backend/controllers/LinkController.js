const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Link = require("../models/Link");

exports.createLink = async (req, res) => {
  try {
    const { originalLink, remarks, expirationDate, device, ipAddress } =
      req.body;
    const userId = req.headers["user-id"];

    // Validate required fields
    if (!originalLink) {
      return res.status(400).json({ error: "Original link is required" });
    }

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Get the real IP address
    const clientIp =
      ipAddress || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const formattedIp = clientIp.replace(/^.*:/, "");

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
    const shortLink = `http://localhost:5000/${randomString}`;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newLink = new Link({
      userId: new ObjectId(userId),
      originalLink: formattedOriginalLink,
      shortLink,
      remarks,
      expirationDate,
      clicks: 0,
      createdAt: currentDate,
      status: expirationDate
        ? new Date(expirationDate) > currentDate
          ? "Active"
          : "Inactive"
        : "Active",
      analytics: {
        device: device || "Desktop",
        ipAddress: formattedIp || "::1",
        timestamp: currentDate,
      },
    });

    await newLink.save();

    // Send formatted date in response
    const responseLink = newLink.toObject();
    responseLink.date = formattedDate;

    res.status(201).json({
      message: "Link created successfully",
      link: responseLink,
    });
  } catch (error) {
    console.error("Link Creation Error:", error);
    res.status(500).json({
      error: "Server error during link creation",
      details: error.message,
    });
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
    const userId = req.headers["user-id"];

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const links = await Link.find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select({
        originalLink: 1,
        shortLink: 1,
        remarks: 1,
        expirationDate: 1,
        clicks: 1,
        createdAt: 1,
        status: 1,
        analytics: 1,
      });

    const formattedLinks = links.map((link) => ({
      _id: link._id,
      originalLink: link.originalLink,
      shortLink: link.shortLink,
      remarks: link.remarks,
      expirationDate: link.expirationDate,
      clicks: link.clicks,
      createdAt: link.createdAt,
      status: link.expirationDate
        ? new Date(link.expirationDate) > new Date()
          ? "Active"
          : "Inactive"
        : "Active",
      analytics: link.analytics,
    }));

    res.status(200).json(formattedLinks);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Server error fetching links" });
  }
};

exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["user-id"];
    const { originalLink, remarks, expirationDate } = req.body;

    // Validate IDs
    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Create update object with only defined values
    const updateData = {};

    if (originalLink) {
      // Format the URL if needed
      updateData.originalLink =
        !originalLink.startsWith("http://") &&
        !originalLink.startsWith("https://")
          ? "https://" + originalLink
          : originalLink;
    }

    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    if (expirationDate !== undefined) {
      updateData.expirationDate = expirationDate;
      updateData.status = expirationDate
        ? new Date(expirationDate) > new Date()
          ? "Active"
          : "Inactive"
        : "Active";
    }

    // Update the link in the database
    const updatedLink = await Link.findOneAndUpdate(
      { _id: id, userId: new ObjectId(userId) },
      { $set: updateData },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Send back the updated link
    res.status(200).json(updatedLink);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error during update" });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["user-id"];

    const deletedLink = await Link.findOneAndDelete({
      _id: id,
      userId: new ObjectId(userId),
    });

    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server error during deletion" });
  }
};
