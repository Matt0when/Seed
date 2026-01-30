const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)', '**/*.test.tsx'],
  testPathIgnorePatterns: [
    './.next/',
    './node_modules/',
  ],
  moduleDirectories: ['<rootDir>', 'node_modules'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/components/$1',
    '^styles/(.*)$': '<rootDir>/styles/$1',
  },
};

module.exports = createJestConfig(config);
