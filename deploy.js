const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Dynamic Deployment Process...\n');

try {
    // 1. Install all dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm run install:all', { stdio: 'inherit' });

    // 2. Build Shop
    console.log('\n🏪 Building Shop App...');
    execSync('npm run build:shop --workspace=frontend', { stdio: 'inherit' });

    // Organize build folder
    if (fs.existsSync('frontend/build-shop')) {
        fs.rmSync('frontend/build-shop', { recursive: true });
    }
    fs.renameSync('frontend/build', 'frontend/build-shop');
    console.log('✅ Shop App built and moved to frontend/build-shop/');

    // 3. Build Admin
    console.log('\n🔐 Building Admin App...');
    execSync('npm run build:admin --workspace=frontend', { stdio: 'inherit' });

    // Organize build folder
    if (fs.existsSync('frontend/build-admin')) {
        fs.rmSync('frontend/build-admin', { recursive: true });
    }
    fs.renameSync('frontend/build', 'frontend/build-admin');
    console.log('✅ Admin App built and moved to frontend/build-admin/');

    console.log('\n✨ ALL BUILDS COMPLETED SUCCESSFULLY! ✨');
    console.log('\n--- NEXT STEPS ---');
    console.log('1. Commit your changes:');
    console.log('   git add .');
    console.log('   git commit -m "Build: Updated production assets"');
    console.log('2. Push to GitHub:');
    console.log('   git push origin main');
    console.log('\nYour GitHub Actions will take over and deploy automatically! 🚀');

} catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
}
