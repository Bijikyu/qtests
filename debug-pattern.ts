import path from 'node:path';

function matchesAnyPattern(filePath: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    // Convert glob pattern to regex (simplified implementation)
    const regexPattern = pattern
      .replace(/\*\*/g, '.*') // ** matches any number of directories
      .replace(/\*/g, '[^/]*') // * matches anything except path separators
      .replace(/\./g, '\\.') // escape dots
      .replace(/\{([^}]+)\}/g, '($1)') // {js,ts} becomes (js|ts)
      .replace(/,/g, '|'); // comma becomes OR
    
    const regex = new RegExp(`^${regexPattern}$`);
    const pathMatch = regex.test(filePath);
    const basenameMatch = regex.test(path.basename(filePath));
    
    console.log(`Pattern: ${pattern}`);
    console.log(`Regex: ^${regexPattern}$`);
    console.log(`File: ${filePath}`);
    console.log(`Basename: ${path.basename(filePath)}`);
    console.log(`Path match: ${pathMatch}, Basename match: ${basenameMatch}`);
    console.log('---');
    
    return pathMatch || basenameMatch;
  });
}

// Test the pattern matching
const testFile = 'simple.test.ts';
const patterns = ['**/*.test.ts'];

console.log('Testing pattern matching:');
console.log(matchesAnyPattern(testFile, patterns));