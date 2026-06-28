import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.useFakeTimers();

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });

  // Завершуємо всі активні таймери та анімації до завершення тесту
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
});
