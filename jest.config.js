module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: [
    '/node_modules',
    '/android',
    './ios'
  ],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "jest-styled-components",
    "./__mocks__/@react-native-async-storage/async-storage.js"
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spect.tsx"
  ],
  coverageReporters: [
    "lcov"
  ]
}