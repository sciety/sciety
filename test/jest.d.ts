/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { DomainEvent } from '../src/domain-events';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeDomainEvent(expectedType: DomainEvent['type'], expectedProperties?: object): T,
    }
  }
}
