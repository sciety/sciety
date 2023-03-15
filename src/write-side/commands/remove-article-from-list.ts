import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { ListIdFromString } from '../../types/list-id';

export const removeArticleFromListCommandCodec = t.type({
  articleId: DoiFromString,
  listId: ListIdFromString,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
