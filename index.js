class Request {
  constructor(httpReq) {
    this.context = httpReq.body.context;
    this.action = httpReq.body.action;
    console.log('NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}')
  }

  do(npkResponse){
    this.actionRequest(npkResponse)
  }

  actionRequest(response, sendData) {
    let actionName = this.action.actionName;
    let parameters = this.action.parameters;
    console.log("Action Name");
    console.log(actionName);

    let setPar = setParametersFactory(response, sendData)

    let speaker_item = parameters.SpeakerItem
    let web_item = 1  //일단 가위
    // let web_item = outText[contextId[this.context.session.id]].webSelection //일단 가위라고 쳐 가정. 이걸 웹에서 받아올거임. 가위 : 1, 바위 : 0, 보 : -1
    var obj = {game_result : 0, speakerItemInt : 0}
    // let game_result = 0 //일단 지금은 비긴거. 1은 이긴거, -1은 진거(스피커 값에서 웹 값 뺀 값이 0이면 비김, -1, 2는 이긴거. 나머지는 진거)
    // let speakerItemInt = 0 //주먹으로 초기화. 스피커가 낸 아이템을 정수형으로 변환하는 변수


    switch (actionName) {
      case "SayWhatToDoAction": {
        // response.setParameters({
        //     roomExist: 1,
        // }, sendData)
        // let speaker_item = parameters.SpeakerItem
        // if(parameters.length != 0 && speaker_item){
        //   speaker_item = parseString(speaker_item.valueExpression);
        // }
        // if(isNaN(speaker_item)) {
        //   speaker_item = 0; //주먹이라고 일단 해
        // }
        // // setPar({ //올ㅋ
        //   // roomExist: 1
        // response.setParameters({
        //   SpeakerItem: speaker_item
        // }, sendData)
        console.log("드디어 된것이다;;;");
      //  return this.context.session.id; //이거 어따 써? 웹에서 들어오는 응답이랑 매칭?
        break;
      }


      case "WebSelectAction": {
        // let speaker_item = parameters.SpeakerItem
        if(parameters.length != 0 && speaker_item){
          speaker_item = speaker_item.valueExpression;
        }
        if(isNaN(speaker_item)) {
          speaker_item = 0; //주먹이라고 일단 해
        }
        console.log("자, parameters.SpeakerItem 이게 뭔지 말해봐 : ", parameters.SpeakerItem)
        // let web_item = 1 //일단 가위라고 쳐 가정. 이걸 웹에서 받아올거임. 가위 : 1, 바위 : 0, 보 : -1
        // let game_result = 0 //일단 지금은 비긴거. 1은 이긴거, -1은 진거(스피커 값에서 웹 값 뺀 값이 0이면 비김, -1, 2는 이긴거. 나머지는 진거)
        // let speakerItemInt = 0 //주먹으로 초기화. 스피커가 낸 아이템을 정수형으로 변환하는 변수
        if(parameters.SpeakerItem.value == '보'){
          obj.speakerItemInt = -1
        }
        else if(parameters.SpeakerItem.value == '바위'){
          obj.speakerItemInt = 0
        }
         else {
          obj.speakerItemInt = 1  //가위
        }
        console.log("obj.speakerItemInt : ", obj.speakerItemInt);

        if (obj.speakerItemInt - web_item == 0) { //비김
          obj.game_result = "무승부에요."
        }
        else if (obj.speakerItemInt - web_item == 2 || obj.speakerItemInt - web_item == -1) { //이김
          obj.game_result = "스피커 플레이어님이 승리 하였어요."
        } else { //짐
          obj.game_result = "스피커 플레이어님이 패배 하였어요."
        }

        if (!!parameters) { // 파라미터가 존재한다면
          if (parameters.length != 0) {
            //parameters.SpeakerItem
            response.setParameters({
              SpeakerItem: parameters.SpeakerItem.value,
              WebItem: web_item,
              GameResult: obj.game_result
            }, sendData)
          }
        } else { // 파라미터가 없다면

        }
        console.log("\u001b[32m스피커가 낸 거 : \u001b[0m",parameters.SpeakerItem.value);
        console.log("\u001b[32m웹플레이어가 낸 거 : \u001b[0m",web_item);
        console.log("\u001b[32m결과 : \u001b[0m",obj.game_result);
        break;
      }


      case "ResultAction": {
        // let web_item = 1 //일단 가위라고 쳐 가정. 이걸 웹에서 받아올거임. 가위 : 1, 바위 : 0, 보 : -1
        // let game_result = 0 //일단 지금은 비긴거. 1은 이긴거, -1은 진거(스피커 값에서 웹 값 뺀 값이 0이면 비김, -1, 2는 이긴거. 나머지는 진거)
        console.log("현재 문제의 값 : " ,parameters.GameResult.value)
        // if (game_result == 0) { //비김
        //   game_result = "무승부에요."
        // }
        // if (game_result == 1) { //이김
        //   game_result = "스피커 플레이어님이 승리 하였어요."
        // } else { //짐
        //   game_result = "스피커 플레이어님이 패배 하였어요."
        // }

        if(web_item == 1){
          web_item = "가위"
        }

        if(web_item == 0){
          web_item = "바위"
        }

        if(web_item == -1){
          web_item = "보"
        } else {
          console.log('오류에용');
        }

        response.setParameters({
          SpeakerItem: parameters.SpeakerItem.value,
          WebItem: web_item,
          GameResult: parameters.GameResult.value
        }, sendData);
        console.log("\u001b[32m스피커가 낸 거 : \u001b[0m" ,parameters.SpeakerItem.value);
        console.log("\u001b[32m웹플레이어가 낸 거 : \u001b[0m" ,web_item);
        console.log("\u001b[32m결과 : \u001b[0m" ,parameters.GameResult.value);
        break;
      }
    }
  }
}

function setParametersFactory(response, sendData) {
  return function(data) {
    response.setParameters(data, sendData);
  }
}

let messages = {};

function setMessage(sessionId, message) {
  messages[sessionId] = message;
}

function getMessage(sessionId) {
  return messages[sessionId];
}

class Response {
  constructor() {
    this.version = '2.0';
    this.resultCode = 'OK';
    this.output = {};
    this.directives = [];
  }
  setParameters(result, sendData) {
    this.output = {
    //  roomExist: result.roomExist,
      SpeakerItem: result.SpeakerItem,
      WebItem: result.WebItem,
      GameResult: result.GameResult
    }
    // sendData(this);  //sendData가 함수가 아니라 머가 필요하징.
  }
}

const reqObject = (req, res, next) => {
  response = new Response();
  request = new Request(req);
  request.do(response)
  request.actionRequest(response, (r) => {
    res.send(r)
  });
  console.log(`NPKResponse: ${JSON.stringify(response)}`);
  return res.send(response)
};

module.exports = reqObject;
module.exports.setMessage = setMessage;
module.exports.getMessage = getMessage;
