import { CommandHandler } from '../types/command-handler.js';
import {
  AddArticleToListCommand,
  CreateListCommand,
  EditListDetailsCommand,
  RecordSubjectAreaCommand,
  RemoveArticleFromListCommand,
} from './commands/index.js';

export type CommandHandlers = {
  addArticleToList: CommandHandler<AddArticleToListCommand>,
  createList: CommandHandler<CreateListCommand>,
  editListDetails: CommandHandler<EditListDetailsCommand>,
  recordSubjectArea: CommandHandler<RecordSubjectAreaCommand>,
  removeArticleFromList: CommandHandler<RemoveArticleFromListCommand>,
};
