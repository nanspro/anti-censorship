const { bluzelle } = require("bluzelle");

const config = {
  mnemonic:
    "around buzz diagram captain obtain detail salon mango muffin brother morning jeans display attend knife carry green dwarf vendor hungry fan route pumpkin car",
  endpoint: "http://testnet.public.bluzelle.com:1317",
  chain_id: "bluzelle",
  uuid: "tumblr",
};

async function fetchAll() {
  const bz = await bluzelle(config);

  return await bz.keyValues();
}

exports.handler = async (event, context, callback) => {
  let data = await fetchAll();
  data = JSON.stringify(data);
  return {
    statusCode: 200,
    body: data,
  };
};
