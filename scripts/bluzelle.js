const { bluzelle } = require('bluzelle');
const {
  BLUZELLE_MNEMONIC,
  BLUZELLE_CHAIN_ID,
  BLUZELLE_ENDPOINT,
} = require('../config');

const gas_info = {
  gas_price: 10, // maximum price to pay for gas (integer, in ubnt)
  max_gas: 200000, // maximum amount of gas to consume for this call (integer)
  max_fee: 2000000, // maximum amount to charge for this call (integer, in ubnt)
};

const lease_info = {
  days: 60, // number of days (integer)
  hours: 0, // number of hours (integer)
  minutes: 0, // number of minutes (integer)
  seconds: 0, // number of seconds (integer)
};

async function getBluzelleClient(uuid) {
  var cache = {};
  var key = uuid;
  if (cache[key]){
    console.log(cache)
    return cache[key];
  }
  else{
    const config = {
      uuid,
      mnemonic: BLUZELLE_MNEMONIC,
      endpoint: BLUZELLE_ENDPOINT,
      chain_id: BLUZELLE_CHAIN_ID,
    };
    val = await bluzelle(config);
    cache[key] = val;
    return val; 
  }
}

async function save(uuid, key, value) {
  const bz = await getBluzelleClient(uuid);

  await bz.create(key, value, gas_info, lease_info);
  return await bz.read(key);
}

async function fetch(uuid, key) {
  const bz = await getBluzelleClient(uuid);

  return await bz.read(key);
}

async function fetchAll(uuid) {
  const bz = await getBluzelleClient(uuid);

  return await bz.keyValues();
}

async function keyExists(uuid, key) {
  const bz = await getBluzelleClient(uuid);

  return await bz.has(key);
}

module.exports = { fetch, save, fetchAll, keyExists };
