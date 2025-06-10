// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  // transform all .js files (your code & tests) with babel-jest
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  // ignore changing node_modules
  transformIgnorePatterns: ['/node_modules/'],
  // pick up your .env
  setupFiles: ['dotenv/config'],
  // run setup.js before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // look for any tests/**/*.(test|spec).js
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/'],
};
