import { AddArticleToListCommand } from '../write-side/commands/index.js';
import { CommandHandler } from '../types/command-handler.js';

export type AddArticleToList = CommandHandler<AddArticleToListCommand>;
