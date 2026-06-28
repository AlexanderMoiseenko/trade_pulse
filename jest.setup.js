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
