import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as DE from '../types/data-error.js';
import { Evaluation } from '../types/evaluation.js';
import { EvaluationLocator } from '../types/evaluation-locator.js';
import { SubjectArea } from '../types/subject-area.js';
import { ExpressionDoi } from '../types/expression-doi.js';
import { SearchResults } from '../types/search-results.js';
import { ExpressionFrontMatter } from '../types/expression-front-matter.js';
import { PublishingHistory } from '../types/publishing-history.js';

type FetchExpressionFrontMatter = (expressionDoi: ExpressionDoi)
=> TE.TaskEither<DE.DataError, ExpressionFrontMatter>;

type FetchRelatedPapers = (history: PublishingHistory)
=> TE.TaskEither<DE.DataError, ReadonlyArray<ExpressionDoi>>;

type FetchEvaluation = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FetchPublishingHistory = (
  expressionDoi: ExpressionDoi,
) => TE.TaskEither<DE.DataError, PublishingHistory>;

type GetArticleSubjectArea = (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchForPaperExpressions = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

export type ExternalQueries = {
  fetchExpressionFrontMatter: FetchExpressionFrontMatter,
  fetchRecommendedPapers: FetchRelatedPapers,
  fetchEvaluation: FetchEvaluation,
  fetchStaticFile: FetchStaticFile,
  fetchPublishingHistory: FetchPublishingHistory,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForPaperExpressions: SearchForPaperExpressions,
};
