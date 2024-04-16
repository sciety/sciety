import { CommandHandler } from '../types/command-handler';
import { EditListDetailsCommand } from '../write-side/commands';

export type EditListDetails = CommandHandler<EditListDetailsCommand>;
