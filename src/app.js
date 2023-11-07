const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// app instance
class App {
  express;
  port;

  constructor(controllers, port) {
    this.express = express();
    this.port = port;
    this.initializeMiddleware();
    this.initializeDatabaseConnection();
    this.initializeControllers(controllers);
  }

  // middleware for accepting json body, cors, logging
  initializeMiddleware() {
    this.express.use(bodyParser.text());
    this.express.use(cors());
    this.express.use((req, res, next) => {
      /* Log the req */
      console.log(
        `Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
      );

      res.on("finish", () => {
        /* Log the res */
        console.log(
          `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
        );
      });
      next();
    });
  }
  // connect to mongoDb if connected connect to redis client
  initializeDatabaseConnection() {
    const { Mongo_User, Mongo_Pass, Mongo_Path } = process.env;

    mongoose.set("strictQuery", false);
    mongoose.connect(`mongodb+srv://${Mongo_User}:${Mongo_Pass}@${Mongo_Path}`);

    // On Success Print Username & Path
    mongoose.connection.on("connected", () => {
      console.log(
        `Successful connection to Database: ${Mongo_User}${Mongo_Path}`
      );
    });

    // On MongoDB failure exit
    mongoose.connection.on("error", (err) => {
      console.log("Run npm start again. Error connecting to Database: ", err);
      //On failed connection disconnect server
      process.exit(0);
    });
  }

  //searches through controllers in app instance and uses the correct router endpoint being hit
  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.express.use(controller.router);
    });
  }

  // booting up app instance on port 5555
  listen() {
    this.express.listen(this.port, () => {
      console.log(`App is up and running on this port: ${this.port}`);
    });
  }
}

module.exports = App;
