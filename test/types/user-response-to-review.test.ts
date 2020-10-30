import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';
import UserResponseToReview from '../../src/types/user-response-to-review';

describe('user-response-to-review', () => {
  describe('no-response-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it('return UserFoundReviewHelpful event', () => {
        const userId = toUserId('a-user');
        const reviewId = new Doi('10.1101/12345678');
        const userResponseToReview = new UserResponseToReview(userId, reviewId);

        const events = userResponseToReview.respondHelpful();

        expect(events).toHaveLength(1);
        expect(events[0]).toStrictEqual(expect.objectContaining({
          type: 'UserFoundReviewHelpful',
          userId,
          reviewId,
        }));
      });
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return UserFoundReviewNotHelpful event');
    });

    describe('command: RevokeMyResponse', () => {
      it.todo('error');
    });
  });

  describe('helpful-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it('return no events', () => {
        const userId = toUserId('a-user');
        const reviewId = new Doi('10.1101/12345678');
        const userResponseToReview = new UserResponseToReview(userId, reviewId);
        userResponseToReview.respondHelpful();

        const events = userResponseToReview.respondHelpful();

        expect(events).toHaveLength(0);
      });
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return UserRevokedFindingReviewHelpful and UserFoundReviewNotHelpful events');
    });

    describe('command: RevokeMyResponse', () => {
      it('return UserRevokedFindingReviewHelpful event', () => {
        const userId = toUserId('a-user');
        const reviewId = new Doi('10.1101/12345678');
        const userResponseToReview = new UserResponseToReview(userId, reviewId, 'helpful');

        const events = userResponseToReview.revokeResponse();

        expect(events).toHaveLength(1);
        expect(events[0]).toStrictEqual(expect.objectContaining({
          type: 'UserRevokedFindingReviewHelpful',
          userId,
          reviewId,
        }));
      });
    });
  });

  describe('not-helpful-state for this review and user', () => {
    describe('command: RespondHelpful', () => {
      it.todo('return UserRevokedFindingReviewNotHelpful and UserFoundReviewHelpful events');
    });

    describe('command: RespondNotHelpful', () => {
      it.todo('return no events');
    });

    describe('command: RevokeMyResponse', () => {
      it.todo('return UserRevokedFindingReviewNotHelpful event');
    });
  });
});
