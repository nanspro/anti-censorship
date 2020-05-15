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

// This function needs to be called for each source.
(async function scrapeLatestPosts(blogName, lastFetchedDate = null) {
  var allPosts = [];
  var offset = 0;
  var fetchingOver = false;
  var lastFetchedDate = new Date(lastFetchedDate);

  while (!fetchingOver) {
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
  }

  // Store the posts in Bluzelle DB here.
  console.log(allPosts.length + " posts have been fetched.");

  // Store the date of last fetched post.
  console.log(allPosts[0].date);
})(blogs[0], "2018-01-01 12:31:37 GMT");
