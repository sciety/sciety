import { CreateListCommand } from '../write-side/commands';
import { CommandHandler } from '../types/command-handler';

export type CreateList = CommandHandler<CreateListCommand>;
