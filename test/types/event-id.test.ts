import { toEventId } from '../../src/types/event-id';

describe('event-id', () => {
  it('is a uuid', () => {
    const value = '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84';

    expect(toEventId(value)).toBe(value);
  });

  it('rejects non-uuids', () => {
    expect(() => toEventId('not-a-uuid')).toThrow('\'not-a-uuid\' is not an event ID');
  });
});
