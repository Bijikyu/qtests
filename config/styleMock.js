/**
 * Style Mock for Jest Testing
 * 
 * Purpose: Simple mock to avoid transform errors when testing components
 * that import CSS, SCSS, LESS, or other style files. Jest cannot
 * process these files by default, so we provide an empty object mock.
 * 
 * Usage: Configured in Jest moduleNameMapper to handle style imports:
 *   '\\.(css|less|scss|sass)$': '<rootDir>/config/styleMock.js'
 * 
 * This prevents "SyntaxError: Unexpected token" errors when tests
 * try to import style files that Jest cannot parse.
 */
module.exports = {};

