import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // When Jest sees '@core/xyz', it will look in 'src/core/xyz'
    '^@core/(.*)$': '<rootDir>/src/core/$1',

    // When Jest sees '@modules/xyz', it will look in 'src/modules/xyz'
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
