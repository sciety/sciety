import { GetAllEvents, respondHelpful } from '../../src/respond/respond-helpful-command';
import Doi from '../../src/types/doi';
import { UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../../src/types/domain-events';
import { generate } from '../../src/types/event-id';
import { ReviewId } from '../../src/types/review-id';
import toUserId, { UserId } from '../../src/types/user-id';

type EventType = UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent;

const makeEvent = (type: EventType['type'], userId: UserId, reviewId: ReviewId): EventType => ({
  id: generate(),
  date: new Date(),
  type,
  userId,
  reviewId,
});

const userId = toUserId('someone');
const reviewId = new Doi('10.1234/5678');

describe('respond-helpful-command', () => {
  describe('no-response-state for this review and user', () => {
    it.each([
      ['no events', []],
      ['different review helpful', [
        makeEvent('UserFoundReviewHelpful', userId, new Doi('10.1101/444444')),
      ]],
      ['revoked helpful', [
        makeEvent('UserFoundReviewHelpful', userId, reviewId),
        makeEvent('UserRevokedFindingReviewHelpful', userId, reviewId),
      ]],
    ])('given %s, return UserFoundReviewHelpful event', async (_, history) => {
      const getAllEvents: GetAllEvents = async () => history;

      const events = await respondHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserFoundReviewHelpful',
        userId,
        reviewId,
      });
    });
  });

  describe('helpful-state for this review and user', () => {
    it.each([
      ['single helpful event', [makeEvent('UserFoundReviewHelpful', userId, reviewId)]],
      ['already revoked helpful', [
        makeEvent('UserFoundReviewHelpful', userId, reviewId),
        makeEvent('UserRevokedFindingReviewHelpful', userId, reviewId),
        makeEvent('UserFoundReviewHelpful', userId, reviewId),
      ]],
    ])('given %s, return no events', async (_, history) => {
      const getAllEvents: GetAllEvents = async () => history;

      const events = await respondHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('not-helpful-state for this review and user', () => {
    it.todo('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events');
  });
});
