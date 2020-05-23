const { Client } = require("@conversationai/perspectiveapi-js-client");
const cheerio = require("cheerio");
var tumblr = require("tumblr.js");
const { bluzelle } = require("bluzelle");

const threshold = 0.2;

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Perspective API
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

API_KEY = "AIzaSyAdU3V2-zmidBMLO0s3S0b2TeCy7n8AkjM";
const pclient = new Client(API_KEY);

async function getScores(textToFilter) {
  let scores = {};
  try {
    scores = await pclient.getScores(textToFilter, { attributes });
  } catch (e) {
    console.error(`Failed with error: ${e}`);
  }
  return scores;
}

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

// Bluzelle
const gas_info = {
  gas_price: 100, // maximum price to pay for gas (integer, in ubnt)
  max_gas: 20000000, // maximum amount of gas to consume for this call (integer)
  max_fee: 200000000, // maximum amount to charge for this call (integer, in ubnt)
};

const lease_info = {
  days: 7, // number of days (integer)
  hours: 0, // number of hours (integer)
  minutes: 0, // number of minutes (integer)
  seconds: 0, // number of seconds (integer)
};

const config = {
  mnemonic:
    "around buzz diagram captain obtain detail salon mango muffin brother morning jeans display attend knife carry green dwarf vendor hungry fan route pumpkin car",
  endpoint: "http://testnet.public.bluzelle.com:1317",
  chain_id: "bluzelle",
  uuid: "tumblr",
};

async function save(key, value) {
  const bz = await bluzelle(config);

  console.log(`Proceeding to create DB entry with key ${key}`);
  await bz.create(key, value, gas_info, lease_info);
  // return await bz.read(key);
}

// Tumblr
blogs = [
  "campaignmoney.tumblr.com",
  // "source2012.tumblr.com",
  // "ihopebarackobama.tumblr.com",
  // "ronpaulswanson.tumblr.com",
  // "textsfromhillaryclinton.tumblr.com",
  // "theheritagefoundation.tumblr.com",
  // "newtjudgesyou.tumblr.com",
  // "heygirlitspaulryan.tumblr.com",
  // "barackobama.tumblr.com",
  // "rncresearch.tumblr.com",
  // "decodingmittromney.tumblr.com",
];

var tclient = tumblr.createClient({
  credentials: {
    consumer_key: "GKYrgh2ztxbnFRQq60zqpFmqO5K4Yab3u5j8H5JcG8uPDrQamE",
    consumer_secret: "tluqGIMqZB0LWHFNTCyOYFWZfxvrcCuG7399sETVKyjPH84s3K",
    token: "zSEm2Q4ZvJYV55NWcg6wOgmbbVHGkdDaWu0XRNhogrXO2DSTek",
    token_secret: "HChOCe9uh2TEBBay33KxpYXrTMAiB6vnX6kiZ7MmqvHmOpQ8Yl",
  },
  returnPromises: true,
});

async function getTumblrPost(_post) {
  const post = {
    source: "tumblr",
    id: _post.id,
    url: _post.post_url,
    tags: _post.tags, // format tags
    timestamp: _post.timestamp,
    metadata: {
      type: _post.type,
    },
  };

  switch (_post.type) {
    case "photo":
      post.content = cheerio(_post.caption).text();
      post.mediaUrl = _post.image_permalink;
      break;
    case "video":
      post.content = cheerio(_post.caption).text();
      post.mediaUrl = _post.permalink_url;
      break;
    case "quote":
      post.content = _post.text;
      break;
    case "link":
      post.content = _post.title;
      post.externalLink = _post.url;
      break;
    case "text":
      post.content = cheerio(_post.body).text();
      break;
    default:
      break;
  }

  if (post.content !== "") {
    post.perspectiveScore = await getAverageScore(post.content);
  }
  return post;
}

// This function needs to be called for each source.
async function scrapeLatestPosts(blogName, lastFetchedDate = null) {
  var allPosts = [];
  var offset = 0;
  var fetchingOver = false;
  var lastFetchedDate = new Date(lastFetchedDate);
  console.log(
    `Last fetched date: ${lastFetchedDate}, ${lastFetchedDate.getTime()}`
  );

  while (!fetchingOver) {
    try {
      var resp = await tclient.blogPosts(blogs[0], { offset });
      var posts = resp.posts;
      console.log(
        `${posts.length} posts fetched from request with offset: ${offset}`
      );

      if (posts.length === 0) {
        fetchingOver = true;
      }

      for (var post of posts) {
        postDate = new Date(post.date);
        if (postDate.getTime() > lastFetchedDate.getTime()) {
          allPosts.push(post);
        } else {
          fetchingOver = true;
          break;
        }
      }

      offset += 20;
    } catch (e) {
      console.log(e);
    }

    console.log("Sleeping for 1 second before making request");
    await sleep(1000);
  }

  console.log(
    `${allPosts.length} posts have been fetched from source: ${blogName}`
  );

  console.log("Processing and saving posts to Bluzelle DB");
  let finalPostsLength = 0;
  for (let i = 0; i < allPosts.length; i++) {
    const post = await getTumblrPost(allPosts[i]);
    if (post.perspectiveScore && post.perspectiveScore >= threshold) {
      try {
        await save(post.id, JSON.stringify(post));
        finalPostsLength += 1;
      } catch (e) {
        console.log(`Saving to Bluzelle failed with: ${e}`);
      }
    }
  }

  console.log(`${finalPostsLength} posts have been saved to Bluzelle`);

  // Store lastFetchedDate for blogName in Bluzelle DB.
  lastFetchedDate = allPosts[0].date;
  console.log(lastFetchedDate);
}

exports.handler = async (event, context, callback) => {
  await blogs.forEach(async function (blogName) {
    // Fetch the lastFetchedDate for this blogName from Bluzelle DB.
    const lastFetchedDate = "2016-01-01 00:00:00 GMT";
    await scrapeLatestPosts(blogName, lastFetchedDate);
  });

  return {
    statusCode: 200,
    body: "Posts will be fetched",
  };
};
