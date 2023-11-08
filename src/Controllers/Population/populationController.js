const isCached = require("../../Middleware/redisCache");
const { getPopulation, updatePopulation } = require("./populationService");
const changeLetterFormat = require("../../Utils/properCase");
const { insertRedisVal } = require("../../Utils/redis");
const express = require("express");

// Population Controller - building endpoints
class PopulationController {
  path = "/api/population";
  router = express.Router();

  constructor() {
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(
      `${this.path}/state/:state/city/:city`,
      isCached,
      this.getPopulation
    );
    this.router.put(
      `${this.path}/state/:state/city/:city`,
      this.updatePopulation
    );
  }

  async getPopulation(req, res) {
    try {
      // extract the state and city
      const { state, city } = req.params;

      // make req case sensitive
      const uppercaseState = changeLetterFormat(state);
      const uppercaseCity = changeLetterFormat(city);

      // key of redis city & state
      const cityState = `${uppercaseCity},${uppercaseState}`;

      // if not in redis get it from mongodb
      const { population } = await getPopulation(uppercaseCity, uppercaseState);

      //connect to redis
      await insertRedisVal(cityState, population);

      res.status(200).json({ population: population });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async updatePopulation(req, res) {
    try {
      // extract the state and city
      const { state, city } = req.params;

      //check if we have the required values
      if (!state && !city && !req.body)
        throw new Error("Please enter a valid city and state");

      // make req case sensitive
      const uppercaseState = changeLetterFormat(state);
      const uppercaseCity = changeLetterFormat(city);

      // key of redis city & state
      const cityState = `${uppercaseCity},${uppercaseState}`;

      // changing population to an number
      const newPopulationNumber = parseInt(req.body);

      // checking for if the req.body is a number
      if (
        newPopulationNumber === NaN ||
        typeof newPopulationNumber !== typeof 5
      )
        throw new Error("Population must be a number");

      // object since my service deconstructs an obj
      const requestBody = {
        state: uppercaseState,
        city: uppercaseCity,
        population: newPopulationNumber,
      };

      //update mongodb
      const upsertCount = await updatePopulation(requestBody);

      //update value in redis if exist
      await insertRedisVal(cityState, req.body);

      // return 201 if new doc was created and 200 if it already exist
      if (upsertCount === 0) {
        res.status(200);
      } else {
        res.status(201);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
module.exports = PopulationController;
