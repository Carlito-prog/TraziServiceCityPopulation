const PopulationModel = require("./populationModel");

const getPopulation = async (city, state) => {
  try {
    // find Document
    const foundDoc = await PopulationModel.findOne({ city, state }).catch(
      (err) => {
        console.log(err);
        throw err;
      }
    );

    if (!foundDoc) throw new Error(" City & State not found");

    return foundDoc;
  } catch (err) {
    console.log(err.message);
    throw err.message;
  }
};

const updatePopulation = async (newPopulation) => {
  try {
    // Update Doc or Enter New Doc
    const { population, state, city } = newPopulation;

    //update Mongo DB
    const updatedPopulation = await PopulationModel.updateOne(
      { city, state },
      { $set: { population } },
      { upsert: true }
    )
      .select("population")
      .catch((err) => {
        console.log(err);
        throw err;
      });

    if (!updatedPopulation.acknowledged)
      throw new Error("Population did not update try again");

    return updatedPopulation.upsertedCount;
  } catch (err) {
    console.log(err.message);
    throw err.message;
  }
};

module.exports = {
  getPopulation,
  updatePopulation,
};
