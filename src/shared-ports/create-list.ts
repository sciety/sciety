import { CreateListCommand } from '../write-side/commands';
import { CommandHandler } from '../write-side/command-handlers/command-handler';

export type CreateList = CommandHandler<CreateListCommand>;
