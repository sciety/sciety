import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { Evaluation } from '../types/evaluation';
import { EvaluationLocator } from '../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { SubjectArea } from '../types/subject-area';

type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: Doi,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
}>;

type RelatedArticles = ReadonlyArray<{
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
}>;

type FetchRelatedArticles = (doi: Doi) => TE.TaskEither<DE.DataError, RelatedArticles>;

type FetchReview = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  publishedAt: Date,
  version: number,
}>>;

type GetArticleSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchResult = {
  articleId: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
  nextCursor: O.Option<string>,
};

type SearchForArticles = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

// ts-unused-exports:disable-next-line
export type ExternalQueries = {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForArticles: SearchForArticles,
};
