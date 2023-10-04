import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { ArticleId } from '../../types/article-id';
import { FindVersionsForArticleDoi } from '../../shared-ports';

export type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchArticle: (doi: ArticleId) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

type GetPublishedDateOfMostRecentArticleVersion = (
  adapters: Ports,
  articleId: ArticleId,
) => TE.TaskEither<DE.DataError, O.Option<Date>>;

export const getPublishedDateOfMostRecentArticleVersion: GetPublishedDateOfMostRecentArticleVersion = () => (
  TE.right(O.none)
);
