const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectId: String,
  projectName: String,
  address: String,
  latitude: Number,
  longitude: Number,
  status: String,
  year: Number
});

module.exports = mongoose.model("Project", ProjectSchema);

