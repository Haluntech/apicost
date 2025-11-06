#!/usr/bin/env node

/**
 * Basic usage example for API Cost Guard
 * 
 * This example demonstrates how to use the CLI tool programmatically
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 API Cost Guard - Basic Usage Example\n');

// Initialize configuration
try {
  console.log('1. Initializing configuration...');
  execSync('node dist/index.js init --force', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.log('Initialization may have failed or already exists');
}

// Show current status
try {
  console.log('\n2. Checking current status...');
  execSync('node dist/index.js status', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.log('Status check failed - this is expected without real API keys');
}

// Show predictions
try {
  console.log('\n3. Getting cost predictions...');
  execSync('node dist/index.js predict', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.log('Prediction failed - this is expected without real API keys');
}

// Get optimization suggestions
try {
  console.log('\n4. Getting optimization suggestions...');
  execSync('node dist/index.js suggest', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.log('Suggestions failed - this is expected without real API keys');
}

console.log('\n✅ Example completed!');
console.log('\nNext steps:');
console.log('1. Set up your real API keys with: api-cost init');
console.log('2. Start monitoring your usage with: api-cost status');
console.log('3. Get detailed reports with: api-cost report --format markdown --output report.md');