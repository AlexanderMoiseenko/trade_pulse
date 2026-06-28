module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-redux|@reduxjs/toolkit|immer|react-native-mmkv|@react-navigation|@shopify/flash-list)/)',
  ],
};
