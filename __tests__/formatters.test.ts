import {
  formatPrice,
  formatPercent,
  formatSelectedDate,
} from '../src/helpers/formatters';

describe('formatters helper utilities', () => {
  // ---------------------------------------------------------------------------
  // formatPrice
  // ---------------------------------------------------------------------------
  describe('formatPrice', () => {
    test('should format prices >= 1000 with 2 decimal places', () => {
      // Використовуємо регулярні вирази, оскільки роздільник тисяч залежить від системної локалі (пробіл або кома)
      const formattedLarge = formatPrice(1250.456);
      expect(formattedLarge).toMatch(/^\$1[.,\s]250[.,]46$/);

      const formattedInteger = formatPrice(5000);
      expect(formattedInteger).toMatch(/^\$5[.,\s]000[.,]00$/);
    });

    test('should format prices < 1000 with exactly 4 decimal places', () => {
      expect(formatPrice(12.34567)).toBe('$12.3457');
      expect(formatPrice(0.001)).toBe('$0.0010');
      expect(formatPrice('5.5')).toBe('$5.5000');
    });
  });

  // ---------------------------------------------------------------------------
  // formatPercent
  // ---------------------------------------------------------------------------
  describe('formatPercent', () => {
    test('should prefix positive percentage with + and add % symbol', () => {
      expect(formatPercent('2.456')).toBe('+2.46%');
      expect(formatPercent('0')).toBe('+0.00%');
    });

    test('should keep negative sign for negative percentages', () => {
      expect(formatPercent('-1.2')).toBe('-1.20%');
      expect(formatPercent('-0.005')).toBe('-0.01%');
    });
  });

  // ---------------------------------------------------------------------------
  // formatSelectedDate
  // ---------------------------------------------------------------------------
  describe('formatSelectedDate', () => {
    // Вівторок, 30 червня 2026 р., 17:00:00 (timestamp в мілісекундах)
    const testTimestamp = 1782828000000; 

    test('should format 1H and 4H timeframes as HH:MM only', () => {
      expect(formatSelectedDate(testTimestamp, '1H', false)).toBe('17:00');
      expect(formatSelectedDate(testTimestamp, '4H', false)).toBe('17:00');
    });

    test('should format 1D and 1M with day and month plus time', () => {
      expect(formatSelectedDate(testTimestamp, '1D', false)).toBe('30.06 17:00');
      expect(formatSelectedDate(testTimestamp, '1M', false)).toBe('30.06 17:00');
    });

    test('should format 1W with localized day name, date and time', () => {
      // 30 червня 2026 року — це вівторок (Tue / Вт)
      expect(formatSelectedDate(testTimestamp, '1W', false)).toBe('Tue 30.06 17:00');
      expect(formatSelectedDate(testTimestamp, '1W', true)).toBe('Вт 30.06 17:00');
    });
  });
});
