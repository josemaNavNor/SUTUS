export default {
  transform: {
    '^.+\\.m?jsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/test/integration/**/*.test.js']
};


  