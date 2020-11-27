import { GetAllEvents, respondNotHelpful } from '../../src/respond/respond-not-helpful-command';
import Doi from '../../src/types/doi';
import {
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../src/types/domain-events';
import { generate } from '../../src/types/event-id';
import { ReviewId } from '../../src/types/review-id';
import toUserId, { UserId } from '../../src/types/user-id';

type EventType = UserFoundReviewHelpfulEvent | UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent;

const makeEvent = (type: EventType['type'], userId: UserId, reviewId: ReviewId): EventType => ({
  id: generate(),
  date: new Date(),
  type,
  userId,
  reviewId,
});

const userId = toUserId('someone');
const reviewId = new Doi('10.1234/5678');

describe('respond-not-helpful-command', () => {
  describe('no-response-state for this review and user', () => {
    it.each([
      ['no events', []],
      ['different review not helpful', [
        makeEvent('UserFoundReviewNotHelpful', userId, new Doi('10.1101/444444')),
      ]],
      ['revoked not helpful', [
        makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
        makeEvent('UserRevokedFindingReviewNotHelpful', userId, reviewId),
      ]],
    ])('given %s, return UserFoundReviewNotHelpful event', async (_, history) => {
      const getAllEvents: GetAllEvents = async () => history;

      const events = await respondNotHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'UserFoundReviewNotHelpful',
        userId,
        reviewId,
      });
    });
  });

  describe('not-helpful-state for this review and user', () => {
    it.each([
      ['single not helpful event', [makeEvent('UserFoundReviewNotHelpful', userId, reviewId)]],
      ['already revoked not helpful', [
        makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
        makeEvent('UserRevokedFindingReviewNotHelpful', userId, reviewId),
        makeEvent('UserFoundReviewNotHelpful', userId, reviewId),
      ]],
    ])('given %s, return no events', async (_, history) => {
      const getAllEvents: GetAllEvents = async () => history;

      const events = await respondNotHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(0);
    });
  });

  describe('helpful-state for this review and user', () => {
    it('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events', async () => {
      const history = [makeEvent('UserFoundReviewHelpful', userId, reviewId)];
      const getAllEvents: GetAllEvents = async () => history;

      const events = await respondNotHelpful(getAllEvents)(userId, reviewId);

      expect(events).toHaveLength(2);
      expect(events[0]).toMatchObject({
        type: 'UserRevokedFindingReviewHelpful',
        userId,
        reviewId,
      });
      expect(events[1]).toMatchObject({
        type: 'UserFoundReviewNotHelpful',
        userId,
        reviewId,
      });
    });
  });
});
