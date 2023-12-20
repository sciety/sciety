import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import { ArticleServer } from '../types/article-server';
import { PaperExpression } from '../types/paper-expression';
import * as DE from '../types/data-error';
import { ArticleId } from '../types/article-id';
import { Evaluation } from '../types/evaluation';
import { EvaluationLocator } from '../types/evaluation-locator';
import { SubjectArea } from '../types/subject-area';
import { SearchResults } from '../shared-ports/search-for-articles';
import { ArticleAuthors } from '../types/article-authors';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { PaperExpressionLocator } from './paper-expression-locator';
import { ExpressionDoi } from '../types/expression-doi';

export type ArticleDetails = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: ArticleId,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};

export type PaperExpressionFrontMatter = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};

type FetchArticle = (doi: ArticleId) => TE.TaskEither<DE.DataError, ArticleDetails>;

type FetchPaperExpressionFrontMatter = (paperExpressionLocator: PaperExpressionLocator)
=> TE.TaskEither<DE.DataError, PaperExpressionFrontMatter>;

type FetchRelatedPapers = (expressionDoi: ExpressionDoi)
=> TE.TaskEither<DE.DataError, ReadonlyArray<ExpressionDoi>>;

type FetchReview = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FindAllExpressionsOfPaper = (
  expressionDoi: ExpressionDoi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<PaperExpression>>;

type GetArticleSubjectArea = (articleId: ArticleId) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchForPaperExpressions = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

export type ExternalQueries = {
  fetchArticle: FetchArticle,
  fetchPaperExpressionFrontMatter: FetchPaperExpressionFrontMatter,
  fetchRecommendedPapers: FetchRelatedPapers,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findAllExpressionsOfPaper: FindAllExpressionsOfPaper,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForPaperExpressions: SearchForPaperExpressions,
};
