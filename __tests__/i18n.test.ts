import { translations } from '../src/constants/translations';

describe('i18n structural integrity', () => {
  // Recursive function for comparing keys in nested objects
  const compareKeys = (
    objA: Record<string, any>,
    objB: Record<string, any>,
    path = '',
  ) => {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    // check if all keys in objA are present in objB
    keysA.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      expect(keysB).toContain(key);

      // If this is a nested object, compare recursively
      if (typeof objA[key] === 'object' && objA[key] !== null) {
        expect(typeof objB[key]).toBe('object');
        compareKeys(objA[key], objB[key], currentPath);
      }
    });

    // check if all keys in objB are present in objA
    keysB.forEach(key => {
      expect(keysA).toContain(key);
    });
  };

  test('English and Ukrainian translation dictionaries should have identical structures', () => {
    compareKeys(translations.en, translations.uk);
  });
});
