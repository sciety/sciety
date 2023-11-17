import * as t from 'io-ts';
import { articleIdCodec } from '../../types/article-id.js';
import { listIdCodec } from '../../types/list-id.js';
import { inputFieldNames } from '../../standards/index.js';

export const paramsCodec = t.type({
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
