// google-sheet: https://developers.google.com/apps-script/reference/spreadsheet/

function doPost(e) {
  // LINE Messenging API Token
  var CHANNEL_ACCESS_TOKEN = 'fake_token';
  // parse JSON
  var msg = JSON.parse(e.postData.contents);

  const replyToken = msg.events[0].replyToken;
  const userMessage = msg.events[0].message.text;
  const user_id = msg.events[0].source.userId;
  const event_type = msg.events[0].source.type; // check is user or group

  function get_user_name() {
      switch (event_type) {
          case "user":
              var nameurl = "https://api.line.me/v2/bot/profile/" + user_id;
              break;
          case "group":
              var groupid = msg.events[0].source.groupId;
              var nameurl = "https://api.line.me/v2/bot/group/" + groupid + "/member/" + user_id;
              break;
      }

      try {
          //  call LINE User Info API, get user name
          var response = UrlFetchApp.fetch(nameurl, {
              "method": "GET",
              "headers": {
                  "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
                  "Content-Type": "application/json"
              },
          });
          var namedata = JSON.parse(response);
          var reserve_name = namedata.displayName;
      }
      catch {
          reserve_name = "not avaliable";
      }
      return String(reserve_name)
  }

  const sheet_url = 'google excel url';
  const SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
  const sheet_name = 'list'
  const sheet = SpreadSheet.getSheetByName(sheet_name);
  const input_len = userMessage.split(" ").length;
  var len = sheet.getDataRange().getValues().length;

  if (userMessage.includes("清單")) {
    var return_text = get_return_text(sheet.getDataRange().getValues())
  }
  else if (userMessage.includes("新增")) {
    if (input_len == 2){
      // var len = sheet.getDataRange().getValues().length;
      var add_name = userMessage.split(" ")[1];
      sheet.appendRow([len+1, add_name]);
      var return_text = "成功新增 " + add_name;
    }
    else {
      var return_text = "輸入的格式怪怪的唷~!(°ー°〃)\n新增之後接空格再接要新增的名稱 (新增 瑜珈)";
    }
  }
  else if (userMessage.includes("說明")) {
    var return_text = "記錄小幫手可用選項ヾ(•ω•`)o:\n1. 清單\n2. 新增(空格後接要新增的運動名稱 e.g. 新增 瑜珈)\n3. 運動(換行之後輸入編號再接數量)\n例: 運動\n1 3\n2 1\n4. 紀錄";
  }
  else if (userMessage.includes("運動")) {
    var return_text = "已經成功新增全部誦經紀錄了唷♪(´▽｀)";
    var text_len = userMessage.split("\n").length;
    var error_row = []
    if (text_len > 1){
      for (var i = 1; i < text_len; i++) {
          var state = true;  // all pass: 1
          var input_data = userMessage.split("\n")[i].split(" ");
          var input_data_len = input_data.length;
          // check input id and number
          if (input_data_len == 2){
            var check_id = false;
            var name_id = input_data[0];
            // check id
            for (var j = 1; j <= len; j++) {
              if (sheet.getRange(j, 1).getValue() == name_id){check_id = true;}
            }
            if (check_id){
              var times = input_data[1];
              var date = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");
              const sheet = SpreadSheet.getSheetByName("log");
              sheet.appendRow([name_id, times, date, get_user_name()]);
            }
            else{state = false;}
          }
          else {
            state = false;
          }
          if (state == false) {
            error_row.push(i+1);
          }
        }
      if (error_row.length != 0){
        return_text = "在第" + error_row + "行資料有問題＞﹏＜\n可能是編號有誤或是忘了空格唷";
        // return_text = userMessage.split("\n")[1].split(" ")[0] + "**" + userMessage.split("\n")[1].split(" ")[1];
      }
    }
    else{
      return_text = "輸入的格式怪怪的唷~!(°ー°〃)\n運動換行之後輸入編號再接數量\n例: 運動\n1 3\n2 1";
    }
  }
  else if (userMessage.includes("紀錄")) {
    var return_text = "紀錄的表單在這邊~\n" + sheet_url;
  }
  else{
    var return_text = "Hi Hi Hi (❁´◡`❁)\n輸入'說明'看看~";
  }

  // output message
  var reply_message = [{
    "type":"text",
    "text": return_text
  }]

  // return resopnse to user
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': reply_message,
    }),
  });
}

// output list pre-process
function get_return_text(sheet_data) {
  var return_text = "運動選項: \n";
  for (var i = 0; i < sheet_data.length; i++) {
    return_text = return_text + sheet_data[i][0] + " " + sheet_data[i][1]
    if (i != sheet_data.length-1){return_text += "\n";}
  }
  return return_text;
}
