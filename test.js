const { save } = require('./scripts/bluzelle');

async function test() {
  let savedValue = await save('test', 'my-key', '{ a: 13 }');
  console.log(savedValue);
}

test();
