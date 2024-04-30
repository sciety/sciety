import * as t from 'io-ts';
import { inputFieldNames } from '../../../standards';
import { articleIdCodec } from '../../../types/article-id';
import { listIdCodec } from '../../../types/list-id';

export const paramsCodec = t.type({
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
