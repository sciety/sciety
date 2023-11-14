import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { unsafeUserInputCodec } from '../../types/unsafe-user-input';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    articleId: DoiFromString,
    listId: listIdCodec,
  }),
  t.partial({
    annotation: unsafeUserInputCodec,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
