import { RuntimeGeneratedEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type HandleResponseToReview = (user: User, reviewId: ReviewId, command: 'respond-helpful'|'revoke-response'|'respond-not-helpful') => Promise<void>;

export type CommandHandler = (userId: UserId, reviewId: ReviewId) => Promise<ReadonlyArray<RuntimeGeneratedEvent>>;

// TODO: should be Promise<void> so that we don't fire and forget?
export type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

export default (
  respondHelpful: CommandHandler,
  revokeResponse: CommandHandler,
  respondNotHelpful: CommandHandler,
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
      case 'respond-not-helpful':
        commitEvents(await respondNotHelpful(user.id, reviewId));
        break;
    }
  }
);
