import { preReviewGroupId } from '../../../src/read-models/evaluations-for-notifications';
import { DependenciesForSagas } from '../../../src/sagas/dependencies-for-sagas';
import { ensureDeliveryOfNotificationsToCoarInboxes } from '../../../src/sagas/ensure-delivery-of-notifications-to-coar-inboxes';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryUrl } from '../../helpers';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('ensure-delivery-of-notifications-to-coar-inboxes', () => {
  let framework: TestFramework;
  let sendCoarNotification: DependenciesForSagas['sendCoarNotification'];
  let commitEvents: DependenciesForSagas['commitEvents'];

  beforeEach(() => {
    framework = createTestFramework();
    sendCoarNotification = jest.fn(framework.dependenciesForSagas.sendCoarNotification);
    commitEvents = jest.fn(framework.commitEvents);
  });

  describe('when there are no pending notifications', () => {
    beforeEach(async () => {
      await ensureDeliveryOfNotificationsToCoarInboxes(
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
    describe('and sendNotification returns a right', () => {
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: preReviewGroupId,
        });
        await ensureDeliveryOfNotificationsToCoarInboxes(
          {
            ...framework.dependenciesForSagas,
            sendCoarNotification,
            commitEvents,
          },
          arbitraryUrl(),
        );
      });

      it('sends the notification to an inbox', () => {
        expect(sendCoarNotification).toHaveBeenCalledTimes(1);
      });

      it.failing('the notification is no longer in the queue', () => {
        const queue = framework.queries.getPendingNotifications();

        expect(queue).toStrictEqual([]);
      });
    });

    describe('and sendNotification returns a left', () => {
      it.todo('leaves the notification as pending');
    });
  });
});
