import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleServer } from '../types/article-server';
import { ArticleId } from '../types/article-id';
import { ArticleVersion } from '../types/article-version';

export type FindVersionsForArticleDoi = (
  doi: ArticleId,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;
