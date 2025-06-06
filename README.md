
# My Utility Module

A simple utility module with common helper functions.

## Installation

```bash
npm install your-module-name
```

## Usage

```javascript
const { greet, capitalize, randomBetween } = require('your-module-name');

// Greet someone
console.log(greet('World')); // "Hello, World!"
console.log(greet('Alice', 'Hi')); // "Hi, Alice!"

// Capitalize words
console.log(capitalize('hello world')); // "Hello World"

// Generate random numbers
console.log(randomBetween(1, 10)); // Random number between 1 and 10
```

## API

### `greet(name, greeting?)`
- `name` (string): The name of the person to greet
- `greeting` (string, optional): Custom greeting (defaults to "Hello")
- Returns: Greeting message string

### `capitalize(str)`
- `str` (string): The string to capitalize
- Returns: String with first letter of each word capitalized

### `randomBetween(min, max)`
- `min` (number): Minimum value (inclusive)
- `max` (number): Maximum value (inclusive)
- Returns: Random integer between min and max

## License

ISC
