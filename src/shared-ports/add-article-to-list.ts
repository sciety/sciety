import { CommandHandler } from '../types/command-handler';
import { Doi } from '../types/doi';
import * as Lid from '../types/list-id';

type AddArticleToListCommandPayload = {
  articleId: Doi, listId: Lid.ListId,
};

export type AddArticleToList = CommandHandler<AddArticleToListCommandPayload>;
