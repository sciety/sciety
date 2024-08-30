import * as E from 'fp-ts/Either';
import { toErrorMessage } from '../../../types/error-message';
import { RecordCoarNotificationDeliveryCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const recordDelivery: ResourceAction<RecordCoarNotificationDeliveryCommand> = (command) => (events) => E.left(toErrorMessage('not-implemented-yet'));
