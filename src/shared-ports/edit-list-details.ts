import { EditListDetailsCommand } from '../write-side/commands/index.js';
import { CommandHandler } from '../types/command-handler.js';

export type EditListDetails = CommandHandler<EditListDetailsCommand>;
