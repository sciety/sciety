import { RemoveArticleFromListCommand } from '../write-side/commands';
import { CommandHandler } from '../types/command-handler';

export type RemoveArticleFromList = CommandHandler<RemoveArticleFromListCommand>;
