import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { ArticleServer } from '../types/article-server';
import { PaperExpression } from '../types/paper-expression';
import * as DE from '../types/data-error';
import { ArticleId } from '../types/article-id';
import { Evaluation } from '../types/evaluation';
import { EvaluationLocator } from '../types/evaluation-locator';
import { SubjectArea } from '../types/subject-area';
import { ArticleAuthors } from '../types/article-authors';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { ExpressionDoi } from '../types/expression-doi';
import { SearchResults } from '../types/search-results';

export type ExpressionFrontMatter = {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
};

type FetchExpressionFrontMatter = (expressionDoi: ExpressionDoi)
=> TE.TaskEither<DE.DataError, ExpressionFrontMatter>;

export type ArticleDetails = ExpressionFrontMatter & {
  doi: ArticleId,
};

type FetchRelatedPapers = (expressionDoi: ExpressionDoi)
=> TE.TaskEither<DE.DataError, ReadonlyArray<ExpressionDoi>>;

type FetchReview = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FindAllExpressionsOfPaper = (
  expressionDoi: ExpressionDoi,
) => TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

type GetArticleSubjectArea = (articleId: ArticleId) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchForPaperExpressions = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

export type ExternalQueries = {
  fetchExpressionFrontMatter: FetchExpressionFrontMatter,
  fetchRecommendedPapers: FetchRelatedPapers,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findAllExpressionsOfPaper: FindAllExpressionsOfPaper,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForPaperExpressions: SearchForPaperExpressions,
};
