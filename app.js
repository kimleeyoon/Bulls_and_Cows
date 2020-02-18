// const express = require("express");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const morgan = require("morgan");
const nugu = require("./nugu");

const { SERVER_PORT } = require("./config.js");
// const routes = require("./routes");
const Router = require("koa-router");

// const app = express();
const app = new Koa();
// let router = express.Router();
let router = new Router();
// app.use(bodyParser.json());
// app.use(morgan("common"));
// app.use((err, req, res, next) => next());

let users = {};

app.use(bodyParser());

// router.route("/GameStartAction").post((req, res, next) => {
//   console.log("GameStartAction");
//   nugu(req, res, next, users);
// });
router.post("/GameStartAction", (ctx, next) => {
  console.log("GameStartAction");
  console.log(JSON.stringify(ctx.request.body));

  nugu(ctx, users);
});
router.post("/ResultAction", (ctx, next) => {
  console.log("ResultAction");
  nugu(ctx, users);
});
router.post("/WinGameAction", (ctx, next) => {
  console.log("WinGameAction");
  nugu(ctx, users);
});
router.post("/ResultAction2", (ctx, next) => {
  console.log("ResultAction2");
  nugu(ctx, users);
});
router.post("/addAction", (ctx, next) => {
  console.log("addAction");
  nugu(ctx, users);
});
router.post("/CheckAction", (ctx, next) => {
  console.log("CheckAction");
  nugu(ctx, users);
});
router.post("/WinGameAction2", (ctx, next) => {
  console.log("WinGameAction2");
  nugu(ctx, users);
});

router.get("/health", (ctx, next) => {
  ctx.body = "OK";
  ctx.status = 200;
});

// app.use("/", router);
app.use(router.routes()).use(router.allowedMethods());

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT} port`);
});
