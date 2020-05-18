const cheerio = require("cheerio");
const filter = require("./filter");

// Some news blogs in tumblr
blogs = [
  "campaignmoney.tumblr.com",
  "source2012.tumblr.com",
  "ihopebarackobama.tumblr.com",
  "ronpaulswanson.tumblr.com",
  "textsfromhillaryclinton.tumblr.com",
  "theheritagefoundation.tumblr.com",
  "newtjudgesyou.tumblr.com",
  "heygirlitspaulryan.tumblr.com",
  "barackobama.tumblr.com",
  "rncresearch.tumblr.com",
  "decodingmittromney.tumblr.com",
];

// Authenticate via OAuth
var tumblr = require("tumblr.js");
var client = tumblr.createClient({
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
    post.perspectiveScore = await filter.getAverageScore(post.content);
  }
  return post;
}

// This function needs to be called for each source.
async function scrapeLatestPosts(blogName, lastFetchedDate = null) {
  var allPosts = [];
  var offset = 0;
  var fetchingOver = false;
  var lastFetchedDate = new Date(lastFetchedDate);

  while (!fetchingOver) {
    try {
      var resp = await client.blogPosts(blogs[0], { offset });
      var posts = resp.posts;

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
  }

  let finalPostsLength = 0;
  allPosts.forEach(async function (_post) {
    const post = await getTumblrPost(_post);
    if (post.perspectiveScore && post.perspectiveScore >= filter.threshold) {
      finalPostsLength += 1;
      // Persist post in Bluzelle DB here.
      // console.log(post);
    }
  });

  console.log(
    `${finalPostsLength} posts have been fetched from source: ${blogName}`
  );

  // Store lastFetchedDate for blogName in Bluzelle DB.
  lastFetchedDate = allPosts[0].date;
  // console.log(lastFetchedDate);
}

(async function main() {
  blogs.forEach(async function (blogName) {
    // Fetch the lastFetchedDate for this blogName from Bluzelle DB.
    const lastFetchedDate = "2018-01-01 12:31:37 GMT";
    await scrapeLatestPosts(blogName, lastFetchedDate);
  });
})();
