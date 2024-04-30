import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../../../types/article-id';
import { userIdCodec } from '../../../types/user-id';

export const paramsCodec = t.strict({
  articleId: articleIdCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

export type Params = t.TypeOf<typeof paramsCodec>;
