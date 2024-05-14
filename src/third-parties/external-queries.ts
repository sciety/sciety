import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { Evaluation } from '../types/evaluation';
import { EvaluationLocator } from '../types/evaluation-locator';
import { ExpressionDoi } from '../types/expression-doi';
import { ExpressionFrontMatter } from '../types/expression-front-matter';
import { PublishingHistory } from '../types/publishing-history';
import { SearchResults } from '../types/search-results';
import { SubjectArea } from '../types/subject-area';
import { UserId } from '../types/user-id';

type FetchExpressionFrontMatter = (expressionDoi: ExpressionDoi)
=> TE.TaskEither<DE.DataError, ExpressionFrontMatter>;

type FetchRecommendedPapers = (history: PublishingHistory)
=> TE.TaskEither<DE.DataError, ReadonlyArray<ExpressionDoi>>;

type FetchEvaluationDigest = (id: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;

type FetchPublishingHistory = (
  expressionDoi: ExpressionDoi,
) => TE.TaskEither<DE.DataError, PublishingHistory>;

type FetchUserAvatarUrl = (userId: UserId) => TE.TaskEither<DE.DataError, string>;

type GetArticleSubjectArea = (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, SubjectArea>;

type SearchForPaperExpressions = (
  pageSize: number,
) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>;

export type ExternalQueries = {
  fetchEvaluationDigest: FetchEvaluationDigest,
  fetchExpressionFrontMatter: FetchExpressionFrontMatter,
  fetchPublishingHistory: FetchPublishingHistory,
  fetchRecommendedPapers: FetchRecommendedPapers,
  fetchStaticFile: FetchStaticFile,
  fetchUserAvatarUrl: FetchUserAvatarUrl,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForPaperExpressions: SearchForPaperExpressions,
};
