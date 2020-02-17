const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nugu = require("./nugu");

const { SERVER_PORT } = require("./config.js");
const routes = require("./routes");

const app = express();
let router = express.Router();
app.use(bodyParser.json());
app.use(morgan("common"));
app.use((err, req, res, next) => next());

let users = {};

// app.use('/', routes);
router.route("/GameStartAction").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/ResultAction").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/WinGameAction").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/ResultAction2").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/addAction").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/CheckAction").post((req, res, next) => {
  nugu(req, res, next, users);
});
router.route("/WinGameAction2").post((req, res, next) => {
  nugu(req, res, next, users);
});

app.use("/", router);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT} port`);
});
