const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const requestBody = req.body;

  // 处理来自 Dialogflow 的请求
  const intentName = requestBody.queryResult.intent.displayName;

  let responseText = '';
  if (intentName === 'Welcome Intent') {
    responseText = 'Here is the information about the movie you asked for.';
} else if (intentName === 'Recommend Movies') {
    responseText = 'Here is the information about the actor you asked for.';
} else {
    responseText = 'Sorry, I don\'t understand.';
}


  // 返回响应到 Dialogflow
  res.json({
    fulfillmentText: responseText,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

