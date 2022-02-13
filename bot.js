const { default: axios } = require('axios');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const { startMessage, CryptoList } = require('./utils');

//keys

const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TOKEN;

const bot = new Telegraf(TOKEN);
//constant
let scale = 5;
let shouldStop = false;

bot.command('/start', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Show Cryptos', callback_data: 'price' }],
        [{ text: 'Follow Crypto state', callback_data: 'follow' }],
      ],
    },
  });
});

//For getting price
bot.action('price', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, CryptoList + '\nTo know the Price.', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Etheruim ⟠', callback_data: 'P_ETH' },
          { text: 'Bit Coin ₿', callback_data: 'P_BTC' },
        ],

        [
          { text: ' XRP ✕', callback_data: 'P_XRP' },
          { text: 'Dogecoin Ð', callback_data: 'P_DOGE' },
        ],
        [{ text: '>', callback_data: 'P_more-coin' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

//more coin for price
bot.action('P_more-coin', (ctx) => {
  ctx.editMessageText(CryptoList, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Tether ₮', callback_data: 'P_USDT' },
          { text: 'Cardano ₳', callback_data: 'P_ADA' },
        ],

        [
          { text: 'Litecoin Ł', callback_data: 'P_LTC' },
          { text: 'Filecoin ⨎', callback_data: 'P_FIL' },
        ],
        [{ text: '<', callback_data: 'price' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

//follow specific crypto state
bot.action('follow', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, CryptoList + '\nto follow its status', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Etheruim ⟠', callback_data: 'F_ETH' },
          { text: 'Bit Coin ₿', callback_data: 'F_BTC' },
        ],

        [
          { text: ' XRP ✕', callback_data: 'F_XRP' },
          { text: 'Dogecoin Ð', callback_data: 'F_DOGE' },
        ],
        [{ text: '>', callback_data: 'F_more-coin' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

//more coin for follow coin
bot.action('F_more-coin', (ctx) => {
  ctx.editMessageText(CryptoList, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Tether ₮', callback_data: 'F_USDT' },
          { text: 'Cardano ₳', callback_data: 'F_ADA' },
        ],

        [
          { text: 'Litecoin Ł', callback_data: 'F_LTC' },
          { text: 'Filecoin ⨎', callback_data: 'F_FIL' },
        ],
        [{ text: '<', callback_data: 'follow' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

//back to main menu
bot.action('back-to-menu', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, 'choose a buttton to continue.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Show Cryptos', callback_data: 'price' }],
        [{ text: 'Follow Crypto state', callback_data: 'follow' }],
      ],
    },
  });
  ctx.answerCbQuery();
});
const coinArr = [
  'F_ETH',
  'F_BTC',
  'F_XRP',
  'F_DOGE',
  'F_USDT',
  'F_ADA',
  'F_LTC',
  'F_FIL',
  'P_ETH',
  'P_BTC',
  'P_XRP',
  'P_DOGE',
  'P_USDT',
  'P_ADA',
  'P_LTC',
  'P_FIL',
];

//?show history

//increase Scale by 5

bot.action('I_5', (ctx) => {
  ctx.deleteMessage();
  if (scale >= 20) {
    ctx.reply('the scale is too much .\nyou will not recive updates quickly.');
    scale += 5;
  } else {
    scale += 5;
  }
  ctx.answerCbQuery('increased update scale by 5');
});
bot.action('D_5', (ctx) => {
  ctx.deleteMessage();
  if (scale <= 5) {
    ctx.reply('the scale is already at minimum');
  } else {
    scale -= 5;
  }
  ctx.answerCbQuery('decreased update scale by 5');
});

//stop following
bot.action('F-stop', (ctx) => {
  ctx.deleteMessage();
  shouldStop = true;
  bot.telegram.sendMessage(ctx.chat.id, 'choose a buttton to continue.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Show Cryptos', callback_data: 'price' }],
        [{ text: 'Follow Crypto state', callback_data: 'follow' }],
      ],
    },
  });
  ctx.answerCbQuery('Stopped following...');
});

//each coin price
bot.action(coinArr, async (ctx) => {
  let symbol = ctx.match[0].split('_')[1];
  console.log(symbol);
  let choosedMenu = ctx.match[0].split('_')[0];

  if (choosedMenu == 'F') {
    //follow the state given coin
    const follMessage = `Following #${symbol} coin.\n@Crypto-Now will let you Know \nif the price changes.\by using scale = ${scale}`;
    bot.telegram.sendMessage(ctx.chat.id, follMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Increase Scale by 5', callback_data: 'I_5' },
            { text: 'Decrease Scale by 5', callback_data: 'D_5' },
          ],
          [{ text: 'Back to Main Menu', callback_data: 'back-to-menu' }],
        ],
      },
    });
    console.log('Follow order');

    setTimeout(async () => {
      while (true) {
        let res = await axios.get(
          `https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=GBP&limit=10&api_key=${API_KEY}`
        );
        let high = res.data.Data.Data[0].high;
        let high10 = res.data.Data.Data[10].high;

        let low = res.data.Data.Data[0].low;
        let low10 = res.data.Data.Data[10].low;
        console.log(high, high10);

        if (high10 - high >= scale) {
          console.log('bingo');
          let res = await axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`
          );
          let priceNow = res.data.USD;
          console.log(priceNow);
          const incMessage = `${symbol} coin is increasing in price...\nFrom ${high} to ${high10} #high \nby ${scale} scale.\nCurrent Price :${priceNow}`;
          bot.telegram.sendMessage(ctx.chat.id, incMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Increase Scale by 5', callback_data: 'I_5' },
                  { text: 'Decrease Scale by 5', callback_data: 'D_5' },
                ],
                [
                  {
                    text: 'Stop following this coin ',
                    callback_data: 'F-stop',
                  },
                ],
                [{ text: 'Back to Main Menu', callback_data: 'back-to-menu' }],
              ],
            },
          });
          if (shouldStop) {
            break;
          } else {
            continue;
          }
        }
        if (low - low10 >= scale) {
          console.log('bingo');
          let res = await axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}`
          );
          let priceNow = res.data.USD;
          console.log(priceNow);
          let decMessage = `${symbol} coin is decreasing in price...\nFrom ${high} to ${high10} #high by ${scale} scale.\nCurrent Price :${priceNow}`;
          bot.telegram.sendMessage(ctx.chat.id, decMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Increase Scale by 5', callback_data: 'I_5' },
                  { text: 'Decrease Scale by 5', callback_data: 'D_5' },
                ],
                [
                  {
                    text: 'Stop following this coin ',
                    callback_data: 'back-to-menu',
                  },
                ],
                [{ text: 'Back to Main Menu', callback_data: 'back-to-menu' }],
              ],
            },
          });
          if (shouldStop) {
            break;
          } else {
            continue;
          }
        }
      }
    }, 5000);
    ctx.answerCbQuery();
  } else if (choosedMenu == 'P') {
    //get price info of that coin
    let res = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${API_KEY}`
    );
    let coinPrice = res.data.DISPLAY[symbol].USD.PRICE;
    let imageUrl = res.data.DISPLAY[symbol].USD.IMAGEURL;
    let OPENDAY = res.data.DISPLAY[symbol].USD.OPENDAY;
    let HIGHDAY = res.data.DISPLAY[symbol].USD.HIGHDAY;
    let LOWDAY = res.data.DISPLAY[symbol].USD.LOWDAY;
    let MARKET = res.data.DISPLAY[symbol].USD.MARKET;

    let sendData = `Coin : ${symbol}\nPrice: ${coinPrice}\nOpenDay: ${OPENDAY}\nHighDay: ${HIGHDAY}\nLowDay: ${LOWDAY}\nMarket: ${MARKET}`;
    bot.telegram.sendPhoto(
      ctx.chat.id,
      `https://www.cryptocompare.com/${imageUrl}`
    );
    setTimeout(() => {
      bot.telegram.sendMessage(ctx.chat.id, sendData, {
        reply_markup: {
          inline_keyboard: [[{ text: 'Back', callback_data: 'back-to-menu' }]],
        },
      });
    }, 100);
    ctx.answerCbQuery();
  }
});

module.exports = bot;
