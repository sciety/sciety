import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import * as Lid from '../types/list-id';

type AddArticleToListCommandPayload = {
  articleId: Doi, listId: Lid.ListId,
};

export type AddArticleToList = (payload: AddArticleToListCommandPayload) => TE.TaskEither<string, void>;
