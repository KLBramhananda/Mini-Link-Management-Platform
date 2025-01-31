const express = require("express");
const LinkController = require("../controllers/LinkController");

const router = express.Router();

// Define routes for link operations
router.post("/create", LinkController.createLink);
router.get("/click/:shortLink", LinkController.handleLinkClick);
router.get("/", LinkController.getAllLinks);
router.put("/:id", LinkController.updateLink);
router.delete("/:id", LinkController.deleteLink);

module.exports = router;
