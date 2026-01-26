import { createBeforeSendFilter } from '@/infrastructure/monitoring/sentry/filters';

import type { EventHint } from '@sentry/core';
import type { ErrorEvent } from '@sentry/react-native';


describe('createBeforeSendFilter', () => {
  const filter = createBeforeSendFilter();
  const mockEvent = { event_id: 'test-123' } as ErrorEvent;

  it('should pass through regular errors', () => {
    const hint: EventHint = {
      originalException: new Error('Something went wrong'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBe(mockEvent);
  });

  it('should filter out AbortError', () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    const hint: EventHint = { originalException: abortError };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out TimeoutError', () => {
    const timeoutError = new Error('Timeout');
    timeoutError.name = 'TimeoutError';
    const hint: EventHint = { originalException: timeoutError };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out "Network request failed" message', () => {
    const hint: EventHint = {
      originalException: new Error('Network request failed'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out "Failed to fetch" message', () => {
    const hint: EventHint = {
      originalException: new Error('Failed to fetch'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out "cancelled" message (case insensitive)', () => {
    const hint: EventHint = {
      originalException: new Error('Request was CANCELLED by user'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out "timeout" message', () => {
    const hint: EventHint = {
      originalException: new Error('Connection timeout'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out "ECONNREFUSED" message', () => {
    const hint: EventHint = {
      originalException: new Error('connect ECONNREFUSED 127.0.0.1:3000'),
    };

    const result = filter(mockEvent, hint);

    expect(result).toBeNull();
  });

  it('should filter out event with ignored message in event.message', () => {
    const eventWithMessage = {
      event_id: 'test-123',
      message: 'Network request failed',
    } as ErrorEvent;
    const hint: EventHint = { originalException: undefined };

    const result = filter(eventWithMessage, hint);

    expect(result).toBeNull();
  });

  it('should pass through errors with other names', () => {
    const otherError = new Error('Some error');
    otherError.name = 'CustomError';
    const hint: EventHint = { originalException: otherError };

    const result = filter(mockEvent, hint);

    expect(result).toBe(mockEvent);
  });

  it('should pass through non-Error exceptions', () => {
    const hint: EventHint = { originalException: 'string error' };

    const result = filter(mockEvent, hint);

    expect(result).toBe(mockEvent);
  });
});
