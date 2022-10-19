import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type RemoveArticleFromList = (command: { listId: ListId, articleId: Doi }) => TE.TaskEither<string, void>;
