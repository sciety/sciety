import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../../src/domain-events';
import { markAsDelivered } from '../../../../src/write-side/resources/coar-notification/mark-as-delivered';
import { arbitraryCoarNotificationDeliveredEvent } from '../../../domain-events/coar-notification-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryMarkCoarNotificationAsDeliveredCommand } from '../../commands/mark-coar-notification-as-delivered-command.helper';

describe('mark-as-delivered', () => {
  const command = arbitraryMarkCoarNotificationAsDeliveredCommand();
  const notificationDeliveredForTheSameEvaluationButDifferentInbox = {
    ...arbitraryCoarNotificationDeliveredEvent(),
    evaluationLocator: command.evaluationLocator,
  } satisfies EventOfType<'CoarNotificationDelivered'>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notificationDeliveredForDifferentEvaluationButTheSameInbox = {
    ...arbitraryCoarNotificationDeliveredEvent(),
    targetId: command.targetId,
  } satisfies EventOfType<'CoarNotificationDelivered'>;
  let result: ReadonlyArray<DomainEvent>;

  describe.each([
    [[]],
    [[notificationDeliveredForTheSameEvaluationButDifferentInbox]],
    // [[notificationDeliveredForDifferentEvaluationButTheSameInbox]],
  ])('given a delivery that has not been recorded yet', (events) => {
    beforeEach(() => {
      result = pipe(
        events,
        markAsDelivered(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('causes a state change in which the delivery has been recorded', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDomainEvent('CoarNotificationDelivered', {
        evaluationLocator: command.evaluationLocator,
        targetId: command.targetId,
      });
    });
  });

  describe('given a delivery that has already been recorded', () => {
    const matchingDeliveryRecorded = {
      ...arbitraryCoarNotificationDeliveredEvent(),
      ...command,
    } satisfies EventOfType<'CoarNotificationDelivered'>;
    const events = [matchingDeliveryRecorded];

    beforeEach(() => {
      result = pipe(
        events,
        markAsDelivered(command),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('accepts the command and causes no state change', () => {
      expect(result).toHaveLength(0);
    });
  });
});
