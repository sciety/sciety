import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleServer } from '../types/article-server.js';
import { ArticleId } from '../types/article-id.js';
import { ArticleVersion } from '../types/article-version.js';

export type FindVersionsForArticleDoi = (
  doi: ArticleId,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;
