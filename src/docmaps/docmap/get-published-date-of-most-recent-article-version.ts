import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { FindVersionsForArticleDoi } from '../../shared-ports';

export type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchArticle: (doi: Doi) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

type GetPublishedDateOfMostRecentArticleVersion = (
  adapters: Ports,
  articleId: Doi,
) => TE.TaskEither<DE.DataError, O.Option<Date>>;

export const getPublishedDateOfMostRecentArticleVersion: GetPublishedDateOfMostRecentArticleVersion = () => (
  TE.right(O.none)
);
