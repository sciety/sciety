import { preReviewGroupId } from '../../../src/read-models/evaluations-for-notifications';
import { DependenciesForSagas } from '../../../src/sagas/dependencies-for-sagas';
import { sendNotificationsToCoarInboxes } from '../../../src/sagas/send-notifications-to-coar-inboxes';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryUrl } from '../../helpers';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('send-notifications-to-coar-inboxes', () => {
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
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: preReviewGroupId,
        });
        await sendNotificationsToCoarInboxes(
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

      it.todo('records the notification as delivered');
    });

    describe('and the target rejects the notification', () => {
      it.todo('leaves the notification as pending');
    });
  });
});
