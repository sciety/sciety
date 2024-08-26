import * as t from 'io-ts';
import { inputFieldNames } from '../../../standards';
import { expressionDoiCodec } from '../../../types/expression-doi';
import { listIdCodec } from '../../../types/list-id';

export const paramsCodec = t.type({
  [inputFieldNames.expressionDoi]: expressionDoiCodec,
  [inputFieldNames.listId]: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
