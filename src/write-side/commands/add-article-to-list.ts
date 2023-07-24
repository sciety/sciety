import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';

export const addArticleToListCommandCodec = t.intersection([
  t.strict({
    articleId: DoiFromString,
    listId: listIdCodec,
  }),
  t.partial({
    issuedAt: tt.DateFromISOString,
  }),
]);

export type AddArticleToListCommand = t.TypeOf<typeof addArticleToListCommandCodec>;
