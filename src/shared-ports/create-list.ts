import { CommandHandler } from '../types/command-handler';
import { CreateListCommand } from '../write-side/commands';

export type CreateList = CommandHandler<CreateListCommand>;
