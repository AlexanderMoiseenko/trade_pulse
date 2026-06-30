import { store } from '../src/store';
import { marketApi } from '../src/store/services/marketApi';

describe('marketApi configuration', () => {
  beforeEach(() => {
    // Скидаємо стан API перед кожним тестом
    store.dispatch(marketApi.util.resetApiState());
  });

  test('should register marketApi reducer in rootReducer', () => {
    const state = store.getState();
    expect(state.marketApi).toBeDefined();
  });

  test('should define getMarketData endpoint correctly', () => {
    const endpoint = marketApi.endpoints.getMarketData;
    expect(endpoint).toBeDefined();
    expect(endpoint.name).toBe('getMarketData');
  });

  test('should define getHistoricalData endpoint correctly', () => {
    const endpoint = marketApi.endpoints.getHistoricalData;
    expect(endpoint).toBeDefined();
    expect(endpoint.name).toBe('getHistoricalData');
  });
});
