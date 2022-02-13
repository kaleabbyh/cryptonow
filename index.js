const express = require('express');
const bot = require('./bot');
const app = express();

const url = 'https://crypto-now-api.herokuapp.com';
const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT;
const Full_URL = `https://api.telegram.org/bot${TOKEN}/setwebhook?url=${url}/bot`;

app.use(bot.webhookCallback('/bot'));
bot.telegram.setWebhook(Full_URL);

app.get('/', (req, res) => {
  res.send({
    message: 'Hello there am working ... ',
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
