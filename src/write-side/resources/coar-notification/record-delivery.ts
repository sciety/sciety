import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, isEventOfType } from '../../../domain-events';
import { RecordCoarNotificationDeliveryCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const recordDelivery: ResourceAction<RecordCoarNotificationDeliveryCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('CoarNotificationDelivered')),
  (allInterestingEvents) => (allInterestingEvents.length === 0
    ? [constructEvent('CoarNotificationDelivered')(command)]
    : []
  ),
  E.right,
);
