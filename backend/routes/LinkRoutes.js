const express = require("express");
const LinkController = require("../controllers/LinkController");

const router = express.Router();

// Define routes for link operations
router.post("/create", LinkController.createLink);
router.get("/click/:shortLink", LinkController.handleLinkClick);
router.get("/", LinkController.getAllLinks);

module.exports = router;
