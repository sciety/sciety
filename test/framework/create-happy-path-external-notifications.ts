import * as TE from 'fp-ts/TaskEither';
import { ExternalNotifications } from '../../src/third-parties';

export const createHappyPathExternalNotifications = (): ExternalNotifications => ({
  sendCoarNotification: () => TE.right(undefined),
});
