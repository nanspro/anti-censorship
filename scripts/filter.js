const { Client } = require("@conversationai/perspectiveapi-js-client");
const { save, fetch, keyExist, fetchAll } = require("./bluzelle");
const { PERSPECTIVE_API_KEY } = require("../config");

const client = new Client(PERSPECTIVE_API_KEY);

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
const threshold = 0.5;

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

async function analyzeAndSave(tweets) {
  console.log("All tweets", tweets);
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
    
    if (average < threshold) {
      averages.push(average);
      let savedValue = await save(tweets[i].id, JSON.stringify(tweets[i]));
      console.log("Saved Value", savedValue);
    }
  }

  console.log("Average Scores", averages);
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

module.exports = { threshold, getAverageScore, getScores, analyzeAndSave };
