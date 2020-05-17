const Twit = require("twit");
const { bluzelle } = require("bluzelle");
const { Client } = require("@conversationai/perspectiveapi-js-client");
API_KEY = "AIzaSyAdU3V2-zmidBMLO0s3S0b2TeCy7n8AkjM";

const client = new Client(API_KEY);

var T = new Twit({
  consumer_key: "1vjHlLXELHVzkNAWZ0msm6cAq",
  consumer_secret: "MPawQEtJR8RN1MNAirgeKMVv5EqQXfLmWx51jkKCpno0LPCIUC",
  access_token: "3278644896-a0D15sIOnfIghdgmcXxcKoqxwyb8jxFqZAyzTbY",
  access_token_secret: "k6o04ihpvgY3NSBx9cVK1jizMmYzL675RfQPqcO2TcBlD",
});

// search twitter for all tweets containing the word 'china' since Jan 1, 2020
// T.get('search/tweets', { q: 'china since:2020-01-1', count: 10 }, function(err, data, response) {
//     console.log(data);
// });

async function filterText(text) {
  let results = await client.getScores(text, {
    attributes: ["SEVERE_TOXICITY", "THREAT", "SEXUALLY_EXPLICIT"],
  });
  console.log(results);
  return results;
}

async function getTags(ID) {
  let trends,
    tags = [];
  let res = await T.get("trends/place", { id: ID });
  trends = res.data[0].trends;

  // top 10 trends as tags
  for (var i = 0; i < 10; i++) {
    tags.push(trends[i].name);
  }
  return tags;
}

async function trackTags(tags) {
  // connecting to stream
  var stream = T.stream("statuses/filter", { track: tags, language: "en" });
  var count = 0;
  var texts = [];
  stream.on("tweet", function (tweet) {
    console.log(tweet.text);
    count++;
    if (count < 10) {
      texts.push(tweet.text);
    } else {
      stream.stop();
      console.log(texts);
    }
  });
  // console.log(texts);
  // let score = await filterText(tweet.text);
  // console.log(score);
}

(async function main() {
  await T.get("account/verify_credentials", {
    include_entities: false,
    skip_status: true,
    include_email: false,
  });
  console.log("Authorization successful");

  let tags = await getTags(1);
  console.log(tags);

  await trackTags(tags);
})();
