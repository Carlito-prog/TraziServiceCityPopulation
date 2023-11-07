const App = require("./src/app");
const PopulationController = require("./src/Controllers/Population/populationController");

// Port needs to be 5555
// app instance accepts controllers that are in use
const app = new App([new PopulationController()], 5555);

//start app instance
app.listen();
