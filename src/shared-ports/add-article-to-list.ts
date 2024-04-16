import { CommandHandler } from '../types/command-handler';
import { AddArticleToListCommand } from '../write-side/commands';

export type AddArticleToList = CommandHandler<AddArticleToListCommand>;
