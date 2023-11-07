const { getRedisCache } = require("../Utils/redis");
const changeLetterFormat = require("../Utils/properCase");

const isCached = async (req, res, next) => {
  try {
    const { state, city } = req.params;

    // connect to redis
    // await redis.initializeRedisClient();

    //check if we have the required values
    if (!state && !city) throw new Error("Please enter a valid city and state");

    // make req case sensitive
    const uppercaseState = changeLetterFormat(state);
    const uppercaseCity = changeLetterFormat(city);

    // concat city & state
    const cityState = `${uppercaseCity},${uppercaseState}`;

    // get redis cache
    const cachedData = await getRedisCache(cityState).catch((err) => {
      console.log(err);
    });

    //Return cache data or go get it from Mongo
    if (cachedData) {
      res.status(200).json({ population: cachedData });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = isCached;
