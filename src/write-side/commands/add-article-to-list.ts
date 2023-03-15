import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { ListIdFromString } from '../../types/list-id';

export const addArticleToListCommandCodec = t.type({
  articleId: DoiFromString,
  listId: ListIdFromString,
});

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
