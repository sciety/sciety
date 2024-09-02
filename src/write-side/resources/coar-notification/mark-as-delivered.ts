import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, EventOfType, isEventOfType } from '../../../domain-events';
import { MarkCoarNotificationAsDeliveredCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const isRecordOfMatchingDelivery = (
  command: MarkCoarNotificationAsDeliveredCommand,
) => (
  event: EventOfType<'CoarNotificationDelivered'>,
) => command.targetId === event.targetId;

export const markAsDelivered: ResourceAction<MarkCoarNotificationAsDeliveredCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('CoarNotificationDelivered')),
  RA.filter(isRecordOfMatchingDelivery(command)),
  (allInterestingEvents) => (allInterestingEvents.length === 0
    ? [constructEvent('CoarNotificationDelivered')(command)]
    : []
  ),
  E.right,
);
