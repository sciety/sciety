import * as t from 'io-ts';
import { ArticleServer, articleServerCodec } from './article-server.js';

export type SubjectArea = {
  value: string,
  server: ArticleServer,
};

export const subjectAreaCodec = t.type({
  value: t.string,
  server: articleServerCodec,
});
