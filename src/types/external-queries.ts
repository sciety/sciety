import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import { ArticleDetails } from './article-details';
import { ArticleServer } from './article-server';
import { ArticleVersion } from './article-version';
import * as DE from './data-error';
import { Doi } from './doi';
import { Evaluation } from './evaluation';
import { EvaluationLocator } from './evaluation-locator';
import { RelatedArticle } from './related-article';
import { SearchResults } from './search-results';
import { SubjectArea } from './subject-area';

type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, ArticleDetails>;

type FetchRelatedArticles = (doi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<RelatedArticle>>;

type FetchReview = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

type GetArticleSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchForArticles = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

export type ExternalQueries = {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForArticles: SearchForArticles,
};
