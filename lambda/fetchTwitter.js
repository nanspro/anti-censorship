const { fetch, keyExist, fetchAll } = require("../scripts/bluzelle");

exports.handler = async (event, context, callback) => {
    let data = await fetchAll();
    data = JSON.stringify(data);
    console.log(data);
    return {
      statusCode: 200,
      body: data,
    };
  };