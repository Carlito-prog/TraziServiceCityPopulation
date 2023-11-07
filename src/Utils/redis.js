// scripting redis io
const { Redis } = require("@upstash/redis");
require("dotenv").config();

const redis = new Redis({
  url: "https://promoted-gator-45148.upstash.io",
  token:
    "AbBcACQgMTQ5MzA3Y2UtZGI0MC00N2Y4LThlMWItZDUwYjc3MzY4M2NiN2UzY2JkYmM0MTYyNGM3ZWFhNTA2NmEyNDQwNGE1M2I=",
});

// export methods to use in middleware & controller
const getRedisCache = async (cityState) => {
  try {
    return await redis.get(cityState);
  } catch (err) {
    console.log(err.message);
    throw err.message;
  }
};

const insertRedisVal = async (cityState, population) => {
  try {
    await redis.set(cityState, population).catch((err) => {
      console.log(err);
      throw err;
    });
  } catch (err) {
    console.log(err.message);
    throw err.message;
  }
};

module.exports = {
  insertRedisVal,
  getRedisCache,
};
