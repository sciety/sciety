import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../../src/domain-events';
import { RecordCoarNotificationDeliveryCommand } from '../../../../src/write-side/commands';
import { recordDelivery } from '../../../../src/write-side/resources/coar-notification/record-delivery';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';

const arbitraryRecordCoarNotificationDeliveryCommand = (): RecordCoarNotificationDeliveryCommand => ({
  evaluationLocator: arbitraryEvaluationLocator(),
  targetId: arbitraryString(),
});

describe('record-delivery', () => {
  const command = arbitraryRecordCoarNotificationDeliveryCommand();

  describe('given a delivery that has not been recorded yet', () => {
    const events: ReadonlyArray<DomainEvent> = [];
    let result: ReadonlyArray<DomainEvent>;

    beforeEach(() => {
      result = pipe(
        events,
        recordDelivery(command),
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
    it.todo('accepts the command and causes no state change');
  });
});
