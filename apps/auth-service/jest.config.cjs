module.exports = {
  preset: 'ts-jest/presets/default-esm',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },

  transformIgnorePatterns: [
    "node_modules/(?!(bcrypt-ts)/)"
  ],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },

  testEnvironment: 'node',

  moduleFileExtensions: ['ts', 'js', 'json'],

  roots: ['<rootDir>/src']
};
