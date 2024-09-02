import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { RecordCoarNotificationDeliveryCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const recordDelivery: ResourceAction<RecordCoarNotificationDeliveryCommand> = (command) => (events) => E.right([
  constructEvent('CoarNotificationDelivered')(command),
]);
