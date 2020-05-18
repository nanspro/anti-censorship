const Twit = require("twit");
// const { bluzelle } = require("bluzelle");
const filter = require("../filter");

var T = new Twit({
  consumer_key: "1vjHlLXELHVzkNAWZ0msm6cAq",
  consumer_secret: "MPawQEtJR8RN1MNAirgeKMVv5EqQXfLmWx51jkKCpno0LPCIUC",
  access_token: "3278644896-a0D15sIOnfIghdgmcXxcKoqxwyb8jxFqZAyzTbY",
  access_token_secret: "k6o04ihpvgY3NSBx9cVK1jizMmYzL675RfQPqcO2TcBlD",
});

async function getTags(ID, limit) {
  let trends,
    tags = [];
  let res = await T.get("trends/place", { id: ID });
  trends = res.data[0].trends;

  // top 10 trends as tags
  for (var i = 0; i < limit; i++) {
    tags.push(trends[i].name);
  }
  return tags;
}

async function trackTags(tags, limit) {
  var count = 0;
  var tweets = [];

  // connecting to stream
  var stream = T.stream("statuses/filter", { track: tags, language: "en" });

  stream.on("tweet", function (tweet) {
    console.log(tweet.text);
    count++;
    if (count < limit) {
      tweets.push(tweet.text);
    } else {
      console.log(tweets);
      stream.stop();

      filter.getAverageScoreTweets(tweets);
    }
  });

}

exports.handler = async (event, context, callback) => {
  await T.get("account/verify_credentials", {
    include_entities: false,
    skip_status: true,
    include_email: false,
  });
  console.log("Authorization successful");

  let tags = await getTags(44418, 10);
  console.log(tags);

  // trackTags(tags, 10);
  return {
    statusCode: 200,
    body: tags,
  };
};
