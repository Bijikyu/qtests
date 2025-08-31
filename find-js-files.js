#!/usr/bin/env node
/**
 * Script to find all JavaScript files in the project
 *
 * Searches for .js files and provides detailed information about them.
 * Excludes node_modules and other common ignore directories.
 */
import fs from 'fs';
import path from 'path';
class JSFileFinder {
    constructor() {
        this.excludeDirs = [
            'node_modules',
            '.git',
            'dist',
            'build',
            'coverage',
            '.next',
            '.nuxt'
        ];
        this.results = [];
    }
    /**
     * Walk directory recursively to find JS files
     */
    walkDirectory(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    // Skip excluded directories
                    if (!this.excludeDirs.includes(entry.name)) {
                        this.walkDirectory(fullPath);
                    }
                }
                else if (entry.isFile() && entry.name.endsWith('.js')) {
                    this.analyzeJSFile(fullPath);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    /**
     * Analyze a JavaScript file for module patterns
     */
    analyzeJSFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const stats = fs.statSync(filePath);
            const fileInfo = {
                path: filePath,
                size: stats.size,
                hasRequire: /require\s*\(/.test(content),
                hasModuleExports: /module\.exports/.test(content),
                hasImport: /^import\s+/m.test(content),
                hasExport: /^export\s+/m.test(content),
                isCommonJS: false
            };
            // Determine if it's CommonJS based on patterns
            fileInfo.isCommonJS = fileInfo.hasRequire || fileInfo.hasModuleExports;
            this.results.push(fileInfo);
        }
        catch (error) {
            console.error(`Error analyzing file ${filePath}:`, error);
        }
    }
    /**
     * Generate summary report
     */
    generateReport() {
        const totalFiles = this.results.length;
        const commonJSFiles = this.results.filter(f => f.isCommonJS);
        const esModuleFiles = this.results.filter(f => f.hasImport || f.hasExport);
        const mixedFiles = this.results.filter(f => f.isCommonJS && (f.hasImport || f.hasExport));
        const totalSize = this.results.reduce((sum, f) => sum + f.size, 0);
        console.log('\n📊 JavaScript Files Summary');
        console.log('='.repeat(40));
        console.log(`Total JS files found: ${totalFiles}`);
        console.log(`Total size: ${(totalSize / 1024).toFixed(2)} KB`);
        console.log(`CommonJS files: ${commonJSFiles.length}`);
        console.log(`ES Module files: ${esModuleFiles.length}`);
        console.log(`Mixed module files: ${mixedFiles.length}`);
        if (commonJSFiles.length > 0) {
            console.log('\n🔍 CommonJS Files (using require/module.exports):');
            commonJSFiles.forEach(file => {
                const relativePath = path.relative(process.cwd(), file.path);
                console.log(`  📄 ${relativePath} (${(file.size / 1024).toFixed(1)} KB)`);
            });
        }
        if (esModuleFiles.length > 0) {
            console.log('\n✨ ES Module Files (using import/export):');
            esModuleFiles.filter(f => !f.isCommonJS).forEach(file => {
                const relativePath = path.relative(process.cwd(), file.path);
                console.log(`  📄 ${relativePath} (${(file.size / 1024).toFixed(1)} KB)`);
            });
        }
        if (mixedFiles.length > 0) {
            console.log('\n⚠️  Mixed Module Files (need conversion):');
            mixedFiles.forEach(file => {
                const relativePath = path.relative(process.cwd(), file.path);
                console.log(`  📄 ${relativePath} (${(file.size / 1024).toFixed(1)} KB)`);
            });
        }
        console.log('\n📋 Detailed File List:');
        console.log('-'.repeat(40));
        this.results.forEach(file => {
            const relativePath = path.relative(process.cwd(), file.path);
            const moduleType = file.isCommonJS ? 'CommonJS' :
                (file.hasImport || file.hasExport) ? 'ES Module' : 'Unknown';
            console.log(`${relativePath} | ${moduleType} | ${(file.size / 1024).toFixed(1)} KB`);
        });
    }
    /**
     * Run the file finder
     */
    run() {
        console.log('🔍 Searching for JavaScript files...');
        const startDir = process.argv[2] || '.';
        this.walkDirectory(startDir);
        if (this.results.length === 0) {
            console.log('No JavaScript files found.');
            return;
        }
        this.generateReport();
    }
}
// Run the script
const finder = new JSFileFinder();
finder.run();
