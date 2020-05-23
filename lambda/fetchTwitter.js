const { fetchAll } = require("../scripts/bluzelle");

exports.handler = async (event, context, callback) => {
  let data = await fetchAll("twitter");
  data = JSON.stringify(data);
  return {
    statusCode: 200,
    body: data,
  };
};
