import * as TE from 'fp-ts/TaskEither';
import { RemoveArticleFromListCommand } from '../commands';

export type RemoveArticleFromList = (command: RemoveArticleFromListCommand) => TE.TaskEither<string, void>;
