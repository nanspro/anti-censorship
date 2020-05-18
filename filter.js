const { Client } = require("@conversationai/perspectiveapi-js-client");
API_KEY = "AIzaSyAdU3V2-zmidBMLO0s3S0b2TeCy7n8AkjM";

const client = new Client(API_KEY);

const attributes = [
  "TOXICITY",
  "SEVERE_TOXICITY",
  "IDENTITY_ATTACK",
  "INSULT",
  "PROFANITY",
  "THREAT",
  "SEXUALLY_EXPLICIT",
  "FLIRTATION",
];
const threshold = 0.2;

// example sentences
const examples = [
  "fuck you bitch!",
  "I am just being very polite.",
  "I am being rude.",
  // this gets marked as false which should not be the case.
  "A notable member of the parliament has 15 rape allegations against him.",
];

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

async function getAverageScoreTweets(tweets) {
  console.log("All tweets", tweets);
  let averages = [];

  for (let i = 0; i < tweets.length; i++) {
    const scores = await getScores(tweets[i]);
    const scoresList = Object.values(scores);
    let average = 0.0;

    scoresList.forEach(function (score) {
      average += score;
    });
    average /= scoresList.length;
    averages.push(average);
  }
  console.log(averages);
  return averages;
}

async function getScores(textToFilter) {
  let scores = {};
  try {
    scores = await client.getScores(textToFilter, { attributes });
  } catch (e) {
    console.error(`Failed with error: ${e}`);
  }
  return scores;
}

module.exports = { threshold, getAverageScore, getScores, getAverageScoreTweets };
