//start message
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

const startMessage = `
Welcome to Crypto-Now
Choose a button to continue 

`;

const CryptoList = `
Please choose a Crypto you want.
`;

let coinArr = [];

const getList = async () => {
  let res = await axios.get(
    `https://min-api.cryptocompare.com/data/blockchain/list?api_key=${API_KEY}`
  );
};

//getList();
module.exports = {
  startMessage,
  CryptoList,
};
