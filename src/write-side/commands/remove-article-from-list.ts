import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const removeArticleFromListCommandCodec = t.type({
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type RemoveArticleFromListCommand = t.TypeOf<typeof removeArticleFromListCommandCodec>;
