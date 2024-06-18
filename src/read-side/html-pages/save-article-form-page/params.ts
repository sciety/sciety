import * as t from 'io-ts';
import { articleIdCodec } from '../../../types/article-id';

export const paramsCodec = t.strict({
  articleId: articleIdCodec,
});

export type Params = t.TypeOf<typeof paramsCodec>;
