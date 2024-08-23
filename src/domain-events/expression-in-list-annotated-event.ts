import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { expressionDoiCodec } from '../types/expression-doi';
import { listIdCodec } from '../types/list-id';
import { unsafeUserInputCodec } from '../types/unsafe-user-input';

export const expressionInListAnnotatedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ExpressionInListAnnotated'),
  date: tt.DateFromISOString,
  content: unsafeUserInputCodec,
  expressionDoi: expressionDoiCodec,
  listId: listIdCodec,
});
