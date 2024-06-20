import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { fetchEvaluation } from './fetch-evaluation';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { searchForPaperExpressions } from './search-for-paper-expressions';
import { ExternalQueries } from '../../third-parties';

export const stubAdapters: ExternalQueries = {
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchEvaluationHumanReadableOriginalUrl: () => TE.right(new URL('https://example.com')),
  fetchEvaluationDigest: fetchEvaluation,
  fetchPublishingHistory,
  fetchRecommendedPapers,
  fetchSearchCategories: () => TE.right(['Epidemiology']),
  fetchStaticFile,
  fetchUserAvatarUrl: () => TE.right('/static/images/profile-dark.svg'),
  getArticleSubjectArea: () => TE.right({
    value: 'Biology',
    server: 'biorxiv',
  }),
  searchForPaperExpressions,
};
