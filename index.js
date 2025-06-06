
/**
 * A simple utility module
 */

/**
 * Greets a person with a custom message
 * @param {string} name - The name of the person to greet
 * @param {string} greeting - Optional custom greeting (defaults to "Hello")
 * @returns {string} The greeting message
 */
function greet(name, greeting = "Hello") {
  if (!name) {
    throw new Error("Name is required");
  }
  return `${greeting}, ${name}!`;
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  greet,
  capitalize,
  randomBetween
};
