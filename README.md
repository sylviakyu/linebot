## Line bot tool
#### This tool can add tools in chat room to record data in Google Sheet.

1. copy `line_bot.js` to [Google App Script](<https://script.google.com/home>)
2. login Line developers and get LINE api token
3. paste to `line_bot.js` line 6 `CHANNEL_ACCESS_TOKEN`
```
var CHANNEL_ACCESS_TOKEN = "***";
```
4. create Google Sheet file
5. paste to `line_bot.js` line 44 `sheet_url`
```
const sheet_url = 'url';
```
6. Deploy the Google App Script [Web app]
7. Copy the webhook url to Line Bot Console

#### Reference
[LINE 加一紀錄機器人](<https://github.com/jschang19/plusone-linebot/blob/main/readme.md>)
[google-sheet document](<https://developers.google.com/apps-script/reference/spreadsheet/>)
