import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const addArticleToListCommandCodec = t.type({
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
