import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { ArticleVersion } from '../types/article-version';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;
