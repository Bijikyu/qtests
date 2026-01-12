const fs = require('fs');

console.log('🔍 CRITICAL IMPORT PATH VERIFICATION');

const criticalFiles = [
  'lib/memory/cleanupOperations.ts',
  'lib/memory/globalCleanup.ts', 
  'lib/memory/moduleCleanup.ts',
  'lib/memory/leakDetector.ts',
  'lib/waitForCondition.ts'
];

for (const file of criticalFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasJSImports = content.includes('from "./') || content.includes('from \'./\'');
    const hasInvalidImports = content.includes('from "./') && !content.includes('.ts');
    const hasRelativeImports = content.includes('from "../');
    
    console.log(`📄 ${file}:`);
    console.log(`  Has .js imports: ${hasJSImports}`);
    console.log(`  Has invalid imports: ${hasInvalidImports}`);
    console.log(`  Has relative imports: ${hasRelativeImports}`);
    
    if (hasJSImports || hasInvalidImports) {
      console.log(`  ❌ CRITICAL: Import path issues detected`);
    } else {
      console.log(`  ✅ Import paths look correct`);
    }
  } catch (e) {
    console.log(`  ❌ Could not check ${file}: ${e.message}`);
  }
}

console.log('\n🏆 VERIFICATION COMPLETE');