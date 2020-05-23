const { scrapeLatestPosts } = require("../scripts/tumblr");

const TUMBLR_BLOGS = [
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

exports.handler = async (event, context, callback) => {
  TUMBLR_BLOGS.forEach(function (blogName) {
    // Fetch the lastFetchedDate for this blogName from Bluzelle DB.
    const lastFetchedDate = "2016-01-01 00:00:00 GMT";
    scrapeLatestPosts(blogName, lastFetchedDate);
  });

  return {
    statusCode: 200,
    body: "Posts will be fetched",
  };
};
