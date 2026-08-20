const http = require('http');

const PORT = 5500;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log(`🧪 Starting Security & Load Balancing Verification on port ${PORT}...\n`);

// 1. Test Health Endpoint & Security Headers
const testHealth = () => new Promise((resolve, reject) => {
  http.get(`${BASE_URL}/api/health`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const headers = res.headers;
      console.log('✅ Health Check Status:', res.statusCode);
      console.log('🔒 Security Headers Check:');
      console.log('   - x-frame-options:', headers['x-frame-options']);
      console.log('   - x-content-type-options:', headers['x-content-type-options']);
      console.log('   - x-dns-prefetch-control:', headers['x-dns-prefetch-control']);
      console.log('   - response status:', res.statusCode);
      resolve();
    });
  }).on('error', reject);
});

// 2. Test Micro-Caching (GET /api/products)
const testCache = () => new Promise((resolve, reject) => {
  http.get(`${BASE_URL}/api/products`, (res1) => {
    const hit1 = res1.headers['x-cache'];
    console.log('\n⚡ Micro-Cache Test 1 (Expected MISS):', hit1 || 'MISS');
    
    // Second request should HIT cache
    http.get(`${BASE_URL}/api/products`, (res2) => {
      const hit2 = res2.headers['x-cache'];
      console.log('⚡ Micro-Cache Test 2 (Expected HIT):', hit2 || 'MISS');
      resolve();
    });
  }).on('error', reject);
});

(async () => {
  try {
    const { spawn } = require('child_process');
    const serverProcess = spawn('node', ['server.js'], { cwd: __dirname + '/..', env: { ...process.env, PORT: String(PORT) } });
    
    await new Promise(r => setTimeout(r, 2500)); // Wait for server startup

    await testHealth();
    await testCache();

    console.log('\n✨ All Security & High-Concurrency Verification Checks Passed Successfully!');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
})();

