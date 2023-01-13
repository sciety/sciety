import { AddArticleToListCommand } from '../write-side/commands';
import { CommandHandler } from '../types/command-handler';

export type AddArticleToList = CommandHandler<AddArticleToListCommand>;
