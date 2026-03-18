/**
 * CRON PING SCRIPT
 * Keeps Render Web Service awake and checks health.
 * Usage: node scripts/cron-ping.js
 * Config: API_URL environment variable (usually https://your-app.onrender.com)
 */

const https = require('https');

// Config: Use API_URL from env or fallback
const URL = process.env.API_URL || "https://ecom-rne9.onrender.com";
const HEALTH_ENDPOINT = `${URL}/api/health`;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function ping(attempt = 1) {
    console.log(`[Cron] Attempt #${attempt}: Pinging ${HEALTH_ENDPOINT}...`);

    return new Promise((resolve, reject) => {
        const req = https.get(HEALTH_ENDPOINT, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ [Cron] Success: Server is healthy! (${res.statusCode})`);
                    resolve(true);
                } else if (res.statusCode === 503) {
                    console.warn(`⚠️ [Cron] Status 503: Server is starting but not ready yet.`);
                    reject(new Error(`Service starting (503)`));
                } else {
                    console.error(`❌ [Cron] Failed: Server returned status ${res.statusCode}`);
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (err) => {
            console.error(`❌ [Cron] Error: ${err.message}`);
            reject(err);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function runCron() {
    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await ping(i);
            process.exit(0); // Exit success
        } catch (err) {
            if (i === MAX_RETRIES) {
                console.error(`🛑 [Cron] Fatal: All ${MAX_RETRIES} attempts failed.`);
                process.exit(1); // Exit error
            }
            console.log(`🔄 [Cron] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }
    }
}

runCron();
