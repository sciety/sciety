import { constructEvent, EventOfType } from '../../src/domain-events';

export const arbitraryCoarNotificationDeliveredEvent = (): EventOfType<'CoarNotificationDelivered'> => constructEvent('CoarNotificationDelivered')({
});
