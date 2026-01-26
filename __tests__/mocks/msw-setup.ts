import { server } from '@/__tests__/mocks/server';

export const setupMswServer = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
