// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

module.exports = async () => ({
  ...(await createJestConfig({
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/app/setupTests.ts'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      '^@/app/(.*)$': '<rootDir>/app/$1',
      '^@/(.*)$': '<rootDir>/$1',
      '^zod/v4/core$': '<rootDir>/node_modules/zod/v4/core/index.cjs',
      '^zod$': '<rootDir>/node_modules/zod/index.cjs',
      '^lucide-react/dynamic$': '<rootDir>/test/__mocks__/lucide-dynamic.js',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
  })()),
  // Ensure ESM-only next-intl and use-intl are transformed
  transformIgnorePatterns: ['node_modules/(?!next-intl|use-intl|@hookform/resolvers)/'],
});
