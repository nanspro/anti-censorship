const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // Twitter
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,

  // Perspective API
  PERSPECTIVE_API_KEY: process.env.PERSPECTIVE_API_KEY,
  PERSPECTIVE_API_THRESHOLD: process.env.PERSPECTIVE_API_THRESHOLD,

  // Bluzelle
  BLUZELLE_MNEMONIC:
    'around buzz diagram captain obtain detail salon mango muffin brother morning jeans display attend knife carry green dwarf vendor hungry fan route pumpkin car',
  BLUZELLE_ENDPOINT: 'http://dev.testnet.public.bluzelle.com:1317/',
  BLUZELLE_CHAIN_ID: 'bluzelle',

  //Tumblr
  TUMBLR_CONSUMER_KEY: process.env.TUMBLR_CONSUMER_KEY,
  TUMBLR_CONSUMER_SECRET: process.env.TUMBLR_CONSUMER_SECRET,
  TUMBLR_TOKEN: process.env.TUMBLR_TOKEN,
  TUMBLR_TOKEN_SECRET: process.env.TUMBLR_TOKEN_SECRET,
};
