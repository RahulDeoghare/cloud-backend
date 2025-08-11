const db = require('./src/config/database');
const { testConnection } = require('./src/config/database');

async function runTest() {
  try {
    const result = await testConnection();
    if (result) {
      console.log('Database test passed!');
      process.exit(0);
    } else {
      console.log('Database test failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runTest();