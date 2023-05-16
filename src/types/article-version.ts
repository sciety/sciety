import { URL } from 'url';

export type ArticleVersion = {
  source: URL,
  publishedAt: Date,
  version: number,
};
