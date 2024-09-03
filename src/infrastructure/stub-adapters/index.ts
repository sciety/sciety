import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { fetchByCategory } from './fetch-by-category';
import { fetchEvaluation } from './fetch-evaluation';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { fetchSearchCategories } from './fetch-search-categories';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { searchForPaperExpressions } from './search-for-paper-expressions';
import { ExternalNotifications, ExternalQueries } from '../../third-parties';

export const stubAdapters: ExternalQueries & ExternalNotifications = {
  fetchByCategory,
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchEvaluationHumanReadableOriginalUrl: () => TE.right(new URL('https://example.com')),
  fetchEvaluationDigest: fetchEvaluation,
  fetchPublishingHistory,
  fetchRecommendedPapers,
  fetchSearchCategories,
  fetchStaticFile,
  fetchUserAvatarUrl: () => TE.right('/static/images/profile-dark.svg'),
  searchForPaperExpressions,
  sendCoarNotification: () => TE.right(undefined),
};
