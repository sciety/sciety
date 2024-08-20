import { ExternalNotifications } from './external-notifications';
import { sendCoarNotification } from './send-coar-notification/send-coar-notification';
import { Logger } from '../logger';

export const instantiateExternalNotifications = (logger: Logger): ExternalNotifications => ({
  sendCoarNotification: sendCoarNotification(logger),
});
