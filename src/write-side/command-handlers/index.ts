import {
  AddArticleToListCommand,
  CreateListCommand,
  EditListDetailsCommand,
  RecordSubjectAreaCommand,
  RemoveArticleFromListCommand,
} from '../commands';
import { CommandHandler } from './command-handler';

export { createUserAccountCommandHandler } from './create-user-account-command-handler';
export { updateUserDetailsCommandHandler } from './update-user-details-command-handler';
export { editListDetailsCommandHandler } from './edit-list-details-command-handler';
export { recordEvaluationPublicationCommandHandler } from './record-evaluation-publication-command-handler';
export { createListCommandHandler } from './create-list-command-handler';
export { recordSubjectAreaCommandHandler } from './record-subject-area-command-handler';
export { removeArticleFromListCommandHandler } from './remove-article-from-list-command-handler';
export { followCommandHandler } from './follow-command-handler';
export { unfollowCommandHandler } from './unfollow-command-handler';
export { addArticleToListCommandHandler } from './add-article-to-list-command-handler';

export type CommandHandlers = {
  addArticleToList: CommandHandler<AddArticleToListCommand>,
  createList: CommandHandler<CreateListCommand>,
  editListDetails: CommandHandler<EditListDetailsCommand>,
  recordSubjectArea: CommandHandler<RecordSubjectAreaCommand>,
  removeArticleFromList: CommandHandler<RemoveArticleFromListCommand>,
};
