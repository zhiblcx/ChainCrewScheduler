import { HashPasswordMiddleware } from './hash-password.middleware';

describe('HashPasswordMiddleware', () => {
  it('should be defined', () => {
    expect(new HashPasswordMiddleware()).toBeDefined();
  });
});
