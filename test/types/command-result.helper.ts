import { CommandResult } from '../../src/types/command-result';
import { arbitraryBoolean } from '../helpers';

export const arbitraryCommandResult = (): CommandResult => (arbitraryBoolean() ? 'events-created' : 'no-events-created');
