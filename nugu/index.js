const uuid = require('uuid').v4
const _ = require('lodash')
const {
  DOMAIN
} = require('../config')

function throwDice(diceCount) {
  const results = []
  let midText = ''
  let resultText = ''
  let sum = 0
  console.log(`throw ${diceCount} times`)
  for (let i = 0; i < diceCount; i++) {
    const rand = Math.floor(Math.random() * 6) + 1
    console.log(`${i + 1} time: ${rand}`)
    results.push(rand)
    sum += rand
    midText += `${rand}, `
  }

  midText = midText.replace(/, $/, '')
  return {
    midText,
    sum,
    diceCount
  }
}

class NPKRequest {
  constructor(httpReq) {
    this.context = httpReq.body.context
    this.action = httpReq.body.action
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
  }

  do(npkResponse) {
    this.actionRequest(npkResponse)
  }

  actionRequest(npkResponse) {
    console.log('actionRequest')
    console.dir(this.action)

    const actionName = this.action.actionName
    const parameters = this.action.parameters

    switch (actionName) {
      case 'ThrowDiceAction' || 'ThrowYesAction':
        let diceCount = 1
        if (!!parameters) {
          const diceCountSlot = parameters.diceCount
          if (parameters.length != 0 && diceCountSlot) {
            diceCount = parseInt(diceCountSlot.value)
          }

          if (isNaN(diceCount)) {
            diceCount = 1
          }
        }
        const throwResult = throwDice(diceCount)
        npkResponse.setOutputParameters(throwResult)
        break
    }
  }
}

class NPKResponse {
  constructor() {
    console.log('NPKResponse constructor')

    this.version = '2.0'
    this.resultCode = 'OK'
    this.output = {}
    this.directives = []
  }

  setOutputParameters(throwResult) {

    this.output = {
      diceCount: throwResult.diceCount,
      sum: throwResult.sum,
      midText: throwResult.midText,
    }
  }

}

const nuguReq = function (httpReq, httpRes, next, users) {
  // npkResponse = new NPKResponse()
  // npkRequest = new NPKRequest(httpReq)
  // npkRequest.do(npkResponse)
  // console.log(`NPKResponse: ${JSON.stringify(npkResponse)}`)
  // return httpRes.send(npkResponse)

  // try {
  //   var requestBody = JSON.parse(event.body);
  // } catch (e) {
  //   var requestBody = event;
  // }
  const context = httpReq.body.context;
  const action = httpReq.body.action;

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

  randomNum.random = function (n1, n2) {
    //n1부터 n2까지의 난수
    return parseInt(Math.random() * (n2 - n1 + 1)) + n1;
  };

  randomNum.authNo = function (n) {
    //n자리 난수 생성
    var value = "";
    for (var i = 0; i < n; i++) {
      value += randomNum.random(0, 9);
    }
    return value;
  };

  if (users[id] == "undefined") {
    users[id] = {};
    users[id].number = randomNum.authNo(4);
    users[id].numberOfAttempts = 0;
  }

  // var randomNumber = randomNum.authNo(4); //네 자리 난수 생성
  let user = users[id];
  let randomNumber = user.number;
  let numberOfAttempts = user.numberOfAttempts;

  calculateResult.compare = function (speaker, user, size) {
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
      resultSentence = numEng[ballNum] + "볼 이에요.";
    } else if (strikeNum != 0 && ballNum == 0) {
      resultSentence = numEng[strikeNum] + "스트라이크에요.";
    } else {
      resultSentence =
        numEng[strikeNum] + "스트라이크, " + numEng[ballNum] + "볼 이에요.";
    }

    return resultSentence;
  };

  calculateResult.isWin = function (speaker, user, size) {
    //이기면 1, 아니면 0 반환
    var strikeNum = 0;

    for (var i = 0; i < size; i++) {
      if (speaker[i] == user[i]) {
        strikeNum++;
      }
    }

    if (strikeNum == 4) {
      return "1";
    } else return "0";
  };
  console.log(requestBody);

  switch (actionName) {
    case "GameStartAction": {
      //랜덤으로 4자리 숫자 생성
      userNumber = parameters.user_number.value;
      winGame = calculateResult.isWin(randomNumber, userNumber, 4);
      numberOfAttempts++;
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
      data = callbackResponseBasic(
        "user_num",
        parameters.user_number.value,
        data
      );
      send(data, callback);

      break;
    }

    case "ResultAction": {
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
      send(data, callback);

      break;
    }

    case "WinGameAction": {
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
      send(data, callback);
      break;
    }

    case "ResultAction2": {
      //사용자가 말한 숫자 확인, 결과 출력, 이겼는지 아닌지 여부는 여기서 결정해서 변수값 바꿔줘야 함!
      numberOfAttempts++;
      if (userNumber2 == null) {
        userNumber2 = userNumber;
      }
      let data = callbackResponseBasic(
        "result_sentence2",
        calculateResult.compare(randomNumber, userNumber, 4)
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
      send(data, callback);

      break;
    }

    case "addAction": {
      //사용자가 말한 숫자 확인, 결과 출력, 이겼는지 아닌지 여부는 여기서 결정해서 변수값 바꿔줘야 함!
      if (userNumber2 == null) {
        userNumber2 = userNumber;
      }
      numberOfAttempts++;
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
      send(data, callback);

      break;
    }

    case "CheckAction": {
      //졌으면 가는 브랜치.
      if (userNumber2 == null) {
        userNumber2 = userNumber;
      }
      let data = callbackResponseBasic(
        "result_sentence2",
        calculateResult.compare(randomNumber, userNumber2, 4)
      );
      data = callbackResponseBasic("win_game2", winGame, data);
      data = callbackResponseBasic("speaker_random_num2", randomNumber, data);
      data = callbackResponseBasic("try_num", numberOfAttempts, data);
      data = callbackResponseBasic(
        "game_point",
        gamePoint[numberOfAttempts],
        data
      );
      data = callbackResponseBasic("user_num", userNumber2, data);
      send(data, callback);

      break;
    }

    case "WinGameAction2": {
      //이겼으면 가는 브랜치.
      if (userNumber2 == null) {
        userNumber2 = userNumber;
      }
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
      send(data, callback);

      break;
    }
  }
  return send(data, httpRes.send);
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