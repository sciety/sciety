import * as t from 'io-ts';
import { DoiFromString } from '../../types/codecs/DoiFromString';

export const paramsCodec = t.strict({
  articleId: DoiFromString,
});

export type Params = t.TypeOf<typeof paramsCodec>;
