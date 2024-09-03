import * as TE from 'fp-ts/TaskEither';
import { preReviewGroupId } from '../../../src/read-models/evaluations-for-notifications';
import { DependenciesForSagas } from '../../../src/sagas/dependencies-for-sagas';
import { ensureDeliveryOfNotificationsToCoarInboxes } from '../../../src/sagas/ensure-delivery-of-notifications-to-coar-inboxes';
import { toErrorMessage } from '../../../src/types/error-message';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryString, arbitraryUrl } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
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
    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: preReviewGroupId,
      });
    });

    describe('and sendNotification returns a right', () => {
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

      it('sends the notification to an inbox', () => {
        expect(sendCoarNotification).toHaveBeenCalledTimes(1);
      });

      it('the notification is no longer in the queue', () => {
        const queue = framework.queries.getPendingNotifications();

        expect(queue).toStrictEqual([]);
      });
    });

    describe('and sendNotification returns a left', () => {
      beforeEach(async () => {
        await ensureDeliveryOfNotificationsToCoarInboxes(
          {
            ...framework.dependenciesForSagas,
            sendCoarNotification: () => TE.left(toErrorMessage(arbitraryString())),
            commitEvents,
          },
          arbitraryUrl(),
        );
      });

      it('leaves the notification as pending', () => {
        const queue = framework.queries.getPendingNotifications();

        expect(queue).toHaveLength(1);
      });
    });
  });

  describe('when there are multiple pending notifications', () => {
    const evaluationA = arbitraryEvaluationLocator();
    const evaluationB = arbitraryEvaluationLocator();

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: preReviewGroupId,
        evaluationLocator: evaluationA,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: preReviewGroupId,
        evaluationLocator: evaluationB,
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

    it('sends one notification to an inbox', () => {
      expect(sendCoarNotification).toHaveBeenCalledTimes(1);
    });

    it('removes only the delivered notification from the queue', () => {
      const queue = framework.queries.getPendingNotifications();

      expect(queue).toHaveLength(1);
      expect(queue[0].evaluationLocator).toStrictEqual(evaluationB);
    });
  });
});
