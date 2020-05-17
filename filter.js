const { Client } = require("@conversationai/perspectiveapi-js-client");
API_KEY = 'AIzaSyAdU3V2-zmidBMLO0s3S0b2TeCy7n8AkjM'

const client = new Client(API_KEY);

(async function filterText () {
  let results = await client.getScores("Fuck you bitch!!", {attributes: ["TOXICITY"]});
  console.log("result", results);
  })().catch(e => {
  console.log(e.error);
});
