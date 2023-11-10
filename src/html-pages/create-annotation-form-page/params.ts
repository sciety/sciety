import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { externalInputFieldNames } from '../../standards';

export const paramsCodec = t.type({
  [externalInputFieldNames.articleId]: DoiFromString,
  [externalInputFieldNames.listId]: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
