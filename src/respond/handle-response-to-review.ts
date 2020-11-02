import { respondHelpful, revokeResponse } from './get-user-response-to-review';
import { GetAllEvents } from '../editorial-community-page/get-most-recent-events';
import { UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response') => Promise<void>;

export type CommitEvents = (events: ReadonlyArray<
UserFoundReviewHelpfulEvent|UserRevokedFindingReviewHelpfulEvent
>) => void;

export default (
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
): HandleResponseToReview => (
  async (user, reviewId, command) => {
    switch (command) {
      case 'respond-helpful':
        commitEvents(await respondHelpful(getAllEvents)(user.id, reviewId));
        break;
      case 'revoke-response':
        commitEvents(await revokeResponse()(user.id, reviewId));
        break;
    }
  }
);
