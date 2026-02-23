/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        // テスト用のtsconfigオーバーライド
        module: 'commonjs',
        target: 'es2020',
        strict: true,
        esModuleInterop: true,
        moduleResolution: 'node',
      },
    }],
  },
};
