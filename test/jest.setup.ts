import { DomainEvent } from '../src/domain-events';

expect.extend({
  toBeDomainEvent(actual: DomainEvent, expectedType: DomainEvent['type']) {
    if (actual.type === expectedType) {
      return {
        pass: true,
        message: () => `Expected event not to have type ${expectedType}`,
      };
    }
    return {
      pass: false,
      message: () => `Expected event to have type ${expectedType} but was ${actual.type}`,
    };
  },
});
