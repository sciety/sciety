import { AddArticleToListCommand } from '../commands';
import { CommandHandler } from '../types/command-handler';

export type AddArticleToList = CommandHandler<AddArticleToListCommand>;
