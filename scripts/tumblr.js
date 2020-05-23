const cheerio = require("cheerio");
const tumblr = require("tumblr.js");
const { save } = require("./bluzelle");
const { getAverageScore } = require("./filter");
const {
  TUMBLR_CONSUMER_KEY,
  TUMBLR_CONSUMER_SECRET,
  TUMBLR_TOKEN,
  TUMBLR_TOKEN_SECRET,
  PERSPECTIVE_API_THRESHOLD,
} = require("../config");

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var client = tumblr.createClient({
  credentials: {
    consumer_key: TUMBLR_CONSUMER_KEY,
    consumer_secret: TUMBLR_CONSUMER_SECRET,
    token: TUMBLR_TOKEN,
    token_secret: TUMBLR_TOKEN_SECRET,
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
      var resp = await client.blogPosts(blogName, { offset });
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
    if (
      post.perspectiveScore &&
      post.perspectiveScore >= PERSPECTIVE_API_THRESHOLD
    ) {
      try {
        await save("tumblr", post.id, JSON.stringify(post));
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

module.exports = { scrapeLatestPosts };
