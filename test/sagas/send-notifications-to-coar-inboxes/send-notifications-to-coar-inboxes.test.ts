import { DependenciesForSagas } from '../../../src/sagas/dependencies-for-sagas';
import { sendNotificationsToCoarInboxes } from '../../../src/sagas/send-notifications-to-coar-inboxes';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryUrl } from '../../helpers';

describe('send-notifications-to-coar-inboxes', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no pending notifications', () => {
    let sendCoarNotification: DependenciesForSagas['sendCoarNotification'];
    let commitEvents: DependenciesForSagas['commitEvents'];

    beforeEach(async () => {
      sendCoarNotification = jest.fn(framework.dependenciesForSagas.sendCoarNotification);
      commitEvents = jest.fn(framework.commitEvents);
      await sendNotificationsToCoarInboxes(
        {
          ...framework.dependenciesForSagas,
          sendCoarNotification,
          commitEvents,
        },
        arbitraryUrl(),
      );
    });

    it('does nothing', () => {
      expect(sendCoarNotification).not.toHaveBeenCalled();
      expect(commitEvents).not.toHaveBeenCalled();
    });
  });

  describe('when there is one pending notification', () => {
    describe('and the target accepts the notification', () => {
      it.todo('records the notification as delivered');
    });

    describe('and the target rejects the notification', () => {
      it.todo('leaves the notification as pending');
    });
  });
});
