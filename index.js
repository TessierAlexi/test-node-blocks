#!/usr/bin/env node
/**
 * Quick Node.js API tester
 * Usage:
 *   node testApi.js
 *   OR inline:
 *     node -e "import('node:process').then(()=>import('./testApi.js'))"
 */

// Example API endpoint (replace with your own)
const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';

(async () => {
  try {
    console.log(`Fetching data from: ${API_URL} ...`);

    // Perform GET request
    const response = await fetch(API_URL);

    // Check HTTP status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();

    // Output the result
    console.log('✅ API Response:', data);

  } catch (error) {
    // Handle network or parsing errors
    console.error('❌ Error fetching API:', error.message);
    process.exit(1); // Exit with error code
  }
})();
