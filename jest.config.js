module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@users/(.*)$': '<rootDir>/src/modules/users/$1',
    '^@messages/(.*)$': '<rootDir>/src/modules/messages/$1',
    '^@shared/(.*)$': '<rootDir>/src/modules/shared/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js']
}; 