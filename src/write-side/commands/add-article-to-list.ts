import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { userGeneratedInputCodec } from '../../types/user-generated-input';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    articleId: DoiFromString,
    listId: listIdCodec,
  }),
  t.partial({
    annotation: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false }),
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
