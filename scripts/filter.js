const { Client } = require('@conversationai/perspectiveapi-js-client');
const { save } = require('./bluzelle');
const { PERSPECTIVE_API_KEY } = require('../config');

const PERSPECTIVE_API_ATTRIBUTES = [
  'TOXICITY',
  'SEVERE_TOXICITY',
  'IDENTITY_ATTACK',
  'INSULT',
  'PROFANITY',
  'THREAT',
  'SEXUALLY_EXPLICIT',
  'FLIRTATION',
];

const client = new Client(PERSPECTIVE_API_KEY);

async function getAverageScore(textToFilter) {
  const scores = await getScores(textToFilter);
  const scoresList = Object.values(scores);
  let average = 0.0;

  scoresList.forEach(function (score) {
    average += score;
  });
  average /= scoresList.length;

  return average;
}

async function analyzeAndSaveTwitter(tweets) {
  console.log('All tweets', tweets);
  let averages = [];

  for (let i = 0; i < tweets.length; i++) {
    // using perspective apis
    const scores = await getScores(tweets[i].content);
    const scoresList = Object.values(scores);
    let average = 0.0;

    scoresList.forEach(function (score) {
      average += score;
    });
    average /= scoresList.length;

    if (average >= process.env.PERSPECTIVE_API_THRESHOLD) {
      averages.push(average);
      try {
        let savedValue = await save(
          'twitter',
          tweets[i].id,
          JSON.stringify(tweets[i])
        );
        console.log('Saved Value', savedValue);
      } catch (e) {
        console.log(`Saving to Bluzelle failed with: ${e}`);
      }
    }
  }

  console.log('Average Scores', averages);
  console.log(`${tweets.length} tweets have been saved to Bluzelle`);
  return averages;
}

async function getScores(textToFilter) {
  let scores = {};
  try {
    scores = await client.getScores(textToFilter, {
      attributes: PERSPECTIVE_API_ATTRIBUTES,
    });
  } catch (e) {
    console.error(`Failed with error: ${e}`);
  }
  return scores;
}

module.exports = {
  getAverageScore,
  getScores,
  analyzeAndSaveTwitter,
};
