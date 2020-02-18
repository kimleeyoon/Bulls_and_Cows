const uuid = require("uuid").v4;
const _ = require("lodash");
const { DOMAIN } = require("../config");

const defaultForm = {
  version: "2.0",
  resultCode: "OK",
  output: {
    result_sentence: null,
    win_game: null,
    speaker_random_num: null,
    try_num: null,
    game_point: null,
    user_num: null,
    user_num11: null,
    user_num12: null,
    user_num13: null,
    user_num14: null,
    result_sentence2: null,
    win_game2: null,
    speaker_random_num2: null,
    try_num2: null,
    game_point2: null,
    user_num2: null,
    user_num21: null,
    user_num22: null,
    user_num23: null,
    user_num24: null
  },
  directives: []
};

const nuguReq = function(ctx, users) {
  const context = ctx.request.body.context;
  const action = ctx.request.body.action;

  const actionName = action.actionName;
  const parameters = action.parameters;
  const id = context.session.id;

  // var action = requestBody.action;
  // var actionName = action.actionName;
  // var parameters = action.parameters;
  try {
    let userNumber = parameters.user_number.value;
    let userNumber2 = parameters.user_number2.value;
  } catch (e) {}

  // let numberOfAttempts = 0;
  let winGame = 0;
  var gamePoint = [100, 100, 95, 90, 80, 70, 55, 40, 25, 15, 10, 5, 0];

  var calculateResult = {};

  var randomNum = {};

  randomNum.random = function(n1, n2) {
    //n1부터 n2까지의 난수
    return parseInt(Math.random() * (n2 - n1 + 1)) + n1;
  };

  randomNum.authNo = function(n) {
    //n자리 난수 생성
    var value = "";
    for (var i = 0; i < n; i++) {
      let temp = randomNum.random(0, 9);
      if (value.indexOf(`${temp}`) != -1) {
        i--;
        continue;
      }
      if (i == 0 && temp == "0") {
        i--;
        continue;
      }
      value += temp;
    }
    return value;
  };

  console.log(users[id]);

  if (typeof users[id] == "undefined") {
    users[id] = {};
    users[id].number = randomNum.authNo(4);
    users[id].numberOfAttempts = 0;
    users[id].winGame = 0;
  }

  // var randomNumber = randomNum.authNo(4); //네 자리 난수 생성
  let user = users[id];
  let randomNumber = user.number;
  let numberOfAttempts = user.numberOfAttempts;

  // let callback = httpRes.send;

  calculateResult.compare = function(speaker, user, size) {
    var strikeNum = 0;
    var ballNum = 0;
    var numEng = ["제로", "원", "투", "쓰리", "포"];
    var resultSentence = "";

    for (var i = 0; i < size; i++) {
      if (speaker[i] == user[i]) {
        strikeNum++;
      } else {
        for (var j = 0; j < size; j++) {
          if (user[i] == speaker[j]) {
            ballNum++;
            break;
          }
        }
      }
    }

    if (strikeNum == 0 && ballNum == 0) {
      resultSentence = "일치하는 숫자가 없네요.";
    } else if (strikeNum == 0 && ballNum != 0) {
      resultSentence = numEng[ballNum] + "볼 입니다.";
    } else if (strikeNum != 0 && ballNum == 0) {
      resultSentence = numEng[strikeNum] + "스트라이크에요.";
    } else {
      resultSentence =
        numEng[strikeNum] + "스트라이크, " + numEng[ballNum] + "볼 입니다.";
    }

    return resultSentence;
  };

  calculateResult.isWin = function(speaker, user, size) {
    //이기면 1, 아니면 0 반환
    var strikeNum = 0;

    for (var i = 0; i < size; i++) {
      if (speaker[i] == user[i]) {
        strikeNum++;
      }
    }
    console.log(`speaker : ${speaker}, user : ${user}, strk : ${strikeNum}`);

    if (strikeNum == 4) {
      return "1";
    } else return "0";
  };
  // console.log(requestBody);

  switch (actionName) {
    case "GameStartAction": {
      users[id] = {};
      users[id].number = randomNum.authNo(4);
      users[id].numberOfAttempts = 0;
      users[id].winGame = 0;
      user = users[id];

      //랜덤으로 4자리 숫자 생성
      userNumber = parameters.user_number.value;
      user.userNumber = userNumber;
      winGame = calculateResult.isWin(randomNumber, userNumber, 4);
      user.winGame = winGame;
      numberOfAttempts = user.numberOfAttempts;
      numberOfAttempts++;
      user.numberOfAttempts = numberOfAttempts;
      let data = callbackResponseBasic(
        "result_sentence",
        calculateResult.compare(randomNumber, userNumber, 4)
      );
      data = callbackResponseBasic("win_game", winGame, data);
      data = callbackResponseBasic("speaker_random_num", randomNumber, data);
      data = callbackResponseBasic("try_num", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num", userNumber, data);
      data = callbackResponseBasic("user_num11", userNumber[0], data);
      data = callbackResponseBasic("user_num12", userNumber[1], data);
      data = callbackResponseBasic("user_num13", userNumber[2], data);
      data = callbackResponseBasic("user_num14", userNumber[3], data);
      // send(data, callback)
      // ctx.body = data
      ctx.body = data;

      break;
    }

    case "ResultAction": {
      let data = callbackResponseBasic(
        "result_sentence",
        calculateResult.compare(randomNumber, userNumber, 4)
      );
      winGame = user.winGame;
      data = callbackResponseBasic("win_game", winGame, data);
      data = callbackResponseBasic("speaker_random_num", randomNumber, data);
      data = callbackResponseBasic("try_num", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num", userNumber, data);
      // send(data, callback);
      ctx.body = data;

      break;
    }

    case "WinGameAction": {
      winGame = user.winGame;
      numberOfAttempts = user.numberOfAttempts;
      let data = callbackResponseBasic("result_sentence", "포 스트라이크에요.");
      data = callbackResponseBasic("win_game", winGame, data);
      data = callbackResponseBasic("speaker_random_num", randomNumber, data);
      data = callbackResponseBasic("try_num", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num", userNumber, data);
      // send(data, callback);
      ctx.body = data;
      break;
    }

    case "ResultAction2": {
      //사용자가 말한 숫자 확인, 결과 출력, 이겼는지 아닌지 여부는 여기서 결정해서 변수값 바꿔줘야 함!
      // numberOfAttempts = user.numberOfAttempts;
      // numberOfAttempts++;
      // user.numberOfAttempts = numberOfAttempts;
      // if (userNumber2 == null) {
      //   userNumber2 = userNumber;
      // }
      userNumber2 = user.userNumber;
      let data = callbackResponseBasic(
        "result_sentence2",
        calculateResult.compare(randomNumber, userNumber2, 4)
      );
      winGame = user.winGame;
      data = callbackResponseBasic("win_game2", winGame, data);
      data = callbackResponseBasic("speaker_random_num2", randomNumber, data);
      data = callbackResponseBasic("try_num2", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point2",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num2", userNumber2, data);
      // send(data, callback);
      data = callbackResponseBasic("user_num21", userNumber2[0], data);
      data = callbackResponseBasic("user_num22", userNumber2[1], data);
      data = callbackResponseBasic("user_num23", userNumber2[2], data);
      data = callbackResponseBasic("user_num24", userNumber2[3], data);
      ctx.body = data;

      break;
    }

    case "addAction": {
      //사용자가 말한 숫자 확인, 결과 출력, 이겼는지 아닌지 여부는 여기서 결정해서 변수값 바꿔줘야 함!
      // if (userNumber2 == null) {
      //   userNumber2 = userNumber;
      // }
      userNumber2 = parameters.user_number2.value;
      user.userNumber = userNumber2;
      winGame = calculateResult.isWin(randomNumber, userNumber2, 4);
      console.log(`WinGame : ${winGame}`);
      user.winGame = winGame;
      numberOfAttempts = user.numberOfAttempts;
      numberOfAttempts++;
      user.numberOfAttempts = numberOfAttempts;

      let data = callbackResponseBasic(
        "result_sentence2",
        calculateResult.compare(randomNumber, userNumber2, 4)
      );
      data = callbackResponseBasic("win_game2", winGame, data);
      data = callbackResponseBasic("speaker_random_num2", randomNumber, data);
      data = callbackResponseBasic("try_num2", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point2",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num2", userNumber2, data);
      // send(data, callback);
      ctx.body = data;

      break;
    }

    case "CheckAction": {
      //졌으면 가는 브랜치.
      // if (userNumber2 == null) {
      //   userNumber2 = userNumber;
      // }
      userNumber2 = user.userNumber;
      let data = callbackResponseBasic(
        "result_sentence2",
        calculateResult.compare(randomNumber, userNumber2, 4)
      );
      winGame = user.winGame;
      data = callbackResponseBasic("win_game2", winGame, data);
      data = callbackResponseBasic("speaker_random_num2", randomNumber, data);
      data = callbackResponseBasic("try_num", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num", userNumber2, data);
      // send(data, callback);
      ctx.body = data;

      break;
    }

    case "WinGameAction2": {
      //이겼으면 가는 브랜치.
      // if (userNumber2 == null) {
      //   userNumber2 = userNumber;
      // }
      winGame = user.winGame;
      userNumber2 = user.userNumber;
      let data = callbackResponseBasic(
        "result_sentence2",
        "포 스트라이크에요."
      );
      data = callbackResponseBasic("win_game2", winGame, data);
      data = callbackResponseBasic("speaker_random_num2", randomNumber, data);
      data = callbackResponseBasic("try_num2", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point2",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num2", userNumber2, data);
      // send(data, callback);
      ctx.body = data;

      break;
    }
  }
  // return send(data, httpRes.send);
};

function send(data, callback) {
  console.log(data);
  return callback(data);
  // callback(null, {
  //   statusCode: 200,
  //   body: JSON.stringify(data)
  // });
}

function callbackResponseBasic(parName, element, data = defaultForm) {
  let temp = data.output;
  return {
    ...data,
    output: {
      ...temp,
      [parName]: element
    }
  };
}

module.exports = nuguReq;
