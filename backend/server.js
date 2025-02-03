const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const linkRoutes = require("./routes/LinkRoutes");
const Link = require("./models/Link");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "user-id"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection ERROR:", err);
    console.log("Connection URI:", process.env.MONGO_URI);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// User routes
app.use("/api/users", userRoutes);

// Link routes
app.use("/api/links", linkRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const shortLink = `http://localhost:5000/${req.params.shortUrl}`;
    const link = await Link.findOne({ shortLink });

    if (!link) {
      return res
        .status(404)
        .send(
          '<script>alert("Looking for page does not exist!"); window.location.href = "http://localhost:3001";</script>'
        );
    }

    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
      return res.status(410).json({ message: "This link is no more :(" });
    }

    try {
      new URL(link.originalLink);
    } catch (e) {
      return res
        .status(400)
        .send(
          '<script>alert("Looking for page does not exist!"); window.location.href = "http://localhost:3001";</script>'
        );
    }

    return res.redirect(link.originalLink);
  } catch (error) {
    console.error("Redirection Error:", error);
    return res
      .status(500)
      .send(
        '<script>alert("Looking for page does not exist!"); window.location.href = "http://localhost:3001";</script>'
      );
  }
});

app.get("/api/ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const formattedIp = ip.replace(/^.*:/, "");
  res.json({ ip: formattedIp });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use((error, req, res, next) => {
  console.error("Server Error:", {
    message: error.message,
    stack: error.stack,
  });
  res.status(500).json({ error: "Server processing error" });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
//BRAMHANANDA K L