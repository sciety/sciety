import { DomainEvent } from '../src/domain-events';

expect.extend({
  toBeDomainEvent(actual: DomainEvent, expectedType: DomainEvent['type'], expectedProperties?: object) {
    if (actual.type !== expectedType) {
      return {
        pass: false,
        message: () => `Expected event to have type ${expectedType} but was ${actual.type}`,
      };
    }
    if (expectedProperties) {
      if (this.isNot) {
        expect(actual).not.toStrictEqual(expect.objectContaining(expectedProperties));
      } else {
        expect(actual).toStrictEqual(expect.objectContaining(expectedProperties));
      }
      return {
        pass: !this.isNot,
        message: () => 'Expected event to have the relevant properties',
      };
    }
    return {
      pass: true,
      message: () => 'Expected event not to have the relevant properties',
    };
  },
});
