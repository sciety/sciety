import { RuntimeGeneratedEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response') => Promise<void>;

export type CommandHandler = (userId: UserId, reviewId: ReviewId) => Promise<ReadonlyArray<RuntimeGeneratedEvent>>;

export type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

export default (
  respondHelpful: CommandHandler,
  revokeResponse: CommandHandler,
  commitEvents: CommitEvents,
): HandleResponseToReview => (
  async (user, reviewId, command) => {
    switch (command) {
      case 'respond-helpful':
        commitEvents(await respondHelpful(user.id, reviewId));
        break;
      case 'revoke-response':
        commitEvents(await revokeResponse(user.id, reviewId));
        break;
    }
  }
);
