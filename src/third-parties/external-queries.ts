import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import { ArticleServer } from '../types/article-server.js';
import { ArticleVersion } from '../types/article-version.js';
import * as DE from '../types/data-error.js';
import { ArticleId } from '../types/article-id.js';
import { Evaluation } from '../types/evaluation.js';
import { EvaluationLocator } from '../types/evaluation-locator.js';
import { SubjectArea } from '../types/subject-area.js';
import { SearchResults } from '../shared-ports/search-for-articles.js';
import { ArticleAuthors } from '../types/article-authors.js';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment.js';

export type ArticleDetails = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: ArticleId,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};

type FetchArticle = (doi: ArticleId) => TE.TaskEither<DE.DataError, ArticleDetails>;

type RelatedArticle = {
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

type FetchRelatedArticles = (doi: ArticleId) => TE.TaskEither<DE.DataError, ReadonlyArray<RelatedArticle>>;

type FetchReview = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FindVersionsForArticleDoi = (
  doi: ArticleId,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

type GetArticleSubjectArea = (articleId: ArticleId) => TE.TaskEither<DE.DataError, SubjectArea>;

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
