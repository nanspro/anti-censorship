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
    'ceiling cat potato program palm behave say traffic erupt fault frozen siege good lunch split kidney jeans express help input square violin vacuum arm',
  BLUZELLE_ENDPOINT: 'https://client.sentry.testnet.public.bluzelle.com:1317/',
  BLUZELLE_CHAIN_ID: 'bluzelle-testnet-public-9',

  //Tumblr
  TUMBLR_CONSUMER_KEY: process.env.TUMBLR_CONSUMER_KEY,
  TUMBLR_CONSUMER_SECRET: process.env.TUMBLR_CONSUMER_SECRET,
  TUMBLR_TOKEN: process.env.TUMBLR_TOKEN,
  TUMBLR_TOKEN_SECRET: process.env.TUMBLR_TOKEN_SECRET,
};
