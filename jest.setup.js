jest.mock('react-native-mmkv', () => {
  return {
    createMMKV: jest.fn().mockImplementation(() => {
      const storage = new Map();
      return {
        set: jest.fn((key, value) => storage.set(key, value)),
        getString: jest.fn((key) => storage.get(key)),
        getNumber: jest.fn((key) => storage.get(key)),
        getBoolean: jest.fn((key) => storage.get(key)),
        delete: jest.fn((key) => storage.delete(key)),
        getAllKeys: jest.fn(() => Array.from(storage.keys())),
        clearAll: jest.fn(() => storage.clear()),
        addOnValueChangedListener: jest.fn(),
      };
    }),
  };
});

jest.mock('react-native-ease', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    EaseView: jest.fn().mockImplementation(({ children, ...props }) => {
      return React.createElement(View, props, children);
    }),
  };
});

jest.mock('react-native-gifted-charts', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LineChart: jest.fn().mockImplementation(({ children, ...props }) => {
      return React.createElement(View, props, children);
    }),
    BarChart: jest.fn().mockImplementation(({ children, ...props }) => {
      return React.createElement(View, props, children);
    }),
  };
});
