import { URL } from 'url';

export type ArticleVersion = {
  publisherHtmlUrl: URL,
  publishedAt: Date,
  version: number,
};
