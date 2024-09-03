import * as t from 'io-ts';
import { articleServerCodec } from './article-server';

export const subjectAreaCodec = t.type({
  value: t.string,
  server: articleServerCodec,
});
