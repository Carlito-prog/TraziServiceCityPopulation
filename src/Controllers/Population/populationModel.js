const mongoose = require("mongoose");

// create schema to manipulate the collection
const PopulationSchema = new mongoose.Schema(
  {
    population: {
      type: Number,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PopulationModel = mongoose.model("populations", PopulationSchema);

module.exports = PopulationModel;
