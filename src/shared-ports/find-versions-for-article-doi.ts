import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { URL } from 'url';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  publishedAt: Date,
  version: number,
}>>;
