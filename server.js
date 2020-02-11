const nuguServer = require('./index');
const server = require('./app')(nuguServer);

server.createPromise('1111', voteEnd);

function voteEnd(){
    console.log("voteEnd");
}
//
// class MainServer {
//
//   constructor(nuguServer) {
//     this.express = require(`express`); // 익스프레스 프레임워크
//     this.http = require("http"); //
//     this.static = require("serve-static"); // 서버 경로 재지정 해주는
//     this.path = require("path"); // OS Path 조정 시 사용
//     this.bodyParser = require("body-parser");
//
//     this.nugu = nuguServer;
//
//     this.message = "None";
//
//     this.promises = {};
//
//     // let nugu = require("./index"); // 스피커 서버에서 실행할 프로그램 받아오는 것 -> index.js
//
//     this.app = this.express();
//     this.router = this.express.Router();
//     this.server = this.http.Server(this.app); // 익스프레스 사용해서 서버 생성 및 할당
//     this.io = require("socket.io")(this.server); // socket.io 서버 생성
//     this.redisAdapter = require("socket.io-redis");
//     this.io.adapter(
//       this.redisAdapter({
//         host: "localhost",
//         port: 6379
//       })
//     );
//     // var io = require('socket.io-emitter')(server);
//     // var emitter = require("socket.io-emitter")({
//     //   host: "localhost",
//     //   port: 6379
//     // });
//
//     this.app.use("/", this.static(this.path.join(__dirname, "public/dist"))); // public/dist 폴더를 클라이언트가 루트경로로 접근하도록 해줌
//
//     this.app.use(
//       this.bodyParser.urlencoded({
//         extended: false
//       })
//     );
//     this.app.use(this.bodyParser.json());
//
//     this.app.use((err, req, res, next) => next());
//
//     // routing 시작
//     this.router.route("/nugu/SayWhatToDoAction").post((req, res, next) => {
//       console.log("SayWhatToDoAction 옴");
//       this.nugu(req, res, next, createSystem);
//
//     });
//
//     this.router.route("/nugu/WebSelectAction").post((req, res, next) => {
//       console.log("WebSelectAction 옴");
//       this.nugu(req, res, next, createSystem);
//     });
//
//     this.router.route("/nugu/ResultAction").post((req, res, next) => {
//       console.log("ResultAction 옴");
//       this.nugu(req, res, next, createSystem);
//     });
//
//     // routing 끝
//     this.app.use("/", this.router);
//
//     this.server.listen(3000, () => {
//       console.log("Server is open");
//     });
//
//     this.io.on("connection", socket => {
//       socket.emit("Hello");
//       socket.on("Hello Response", msg => {
//         console.log("Response 왔다고 알려라");
//       });
//
//       socket.on("How are You?", msg => {
//         console.log("I'm fine!");
//       });
//       socket.on("메시지", data => {
//
//       });
//     });
//   }
//
//   setMessage(message) {
//     this.message = message;
//   }
//   getMessage() {
//     return this.message;
//   }
//
//   createPromise(roomId, callBack){
//     this.promises[roomId] = new Promise((callBack, reject) => {
//
//     });
//   }
//
// }
//
// function createServer(nuguServer) {
//   return new MainServer(nuguServer);
// }
//
// module.exports = createServer;
//
// /*
// let systems = new Systems()
//
// function createSystem(id) {
//   systems.appendSystem(id)
// }
//
// class Systems {
//   constructor() {
//     this.systems = []
//   }
//   appendSystem(id) {
//     this.systems[id] = new System()
//   }
// }
// */
//
// // class System {
// //   constructor() {
// //     this.state = "None"
// //     this.speakerItem = "None"
// //     this.methods = {}
// //     this.methods.setSpeakerItem = function(item) {
// //       this.speakerItem = item
// //     }
// //     this.methods.setState = function(item) {
// //       this.state = item
// //     }
// //   }
//
// // }
