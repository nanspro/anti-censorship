const { bluzelle } = require("bluzelle");

const gas_info = {
    gas_price: 100, // maximum price to pay for gas (integer, in ubnt)
    max_gas: 20000000, // maximum amount of gas to consume for this call (integer)
    max_fee: 200000000 // maximum amount to charge for this call (integer, in ubnt)
};

const lease_info = {
    'days':    7, // number of days (integer)
    'hours':   0, // number of hours (integer)
    'minutes': 0,  // number of minutes (integer)
    'seconds': 0  // number of seconds (integer)
};

const config = {
    mnemonic: "around buzz diagram captain obtain detail salon mango muffin brother morning jeans display attend knife carry green dwarf vendor hungry fan route pumpkin car",
    endpoint: "http://testnet.public.bluzelle.com:26657",
    chain_id: 'bluzelle',
    uuid: "twitter"
};

(async () => {
    const bz = await bluzelle(config);

    // await bz.create("name", "rahul", gas_info)
    console.log(await bz.read("name"))
})();