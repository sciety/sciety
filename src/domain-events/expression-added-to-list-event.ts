import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { expressionDoiCodec } from '../types/expression-doi';
import { listIdCodec } from '../types/list-id';

export const expressionAddedToListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ExpressionAddedToList'),
  date: tt.DateFromISOString,
  expressionDoi: expressionDoiCodec,
  listId: listIdCodec,
});
