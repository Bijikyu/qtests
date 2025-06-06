
const { greet, capitalize, randomBetween } = require('./index');

console.log('=== Module Examples ===');

// Greeting examples
console.log(greet('World'));
console.log(greet('Alice', 'Hi'));
console.log(greet('Bob', 'Good morning'));

// Capitalization examples
console.log(capitalize('hello world'));
console.log(capitalize('javascript is awesome'));

// Random number examples
console.log('Random numbers:');
for (let i = 0; i < 5; i++) {
  console.log(randomBetween(1, 100));
}
