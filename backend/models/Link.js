const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalLink: {
    type: String,
    required: true,
  },
  destinationUrl: {
    type: String,
    required: true,
  },
  shortLink: {
    type: String,
    required: true,
    unique: true,
  },
  remarks: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  analytics: {
    device: String,
    ipAddress: String,
    timestamp: Date,
  },
});

linkSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Link", linkSchema);
