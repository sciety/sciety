import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { fetchEvaluation } from './fetch-evaluation';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { fetchSearchCategories } from './fetch-search-categories';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { searchForPaperExpressions } from './search-for-paper-expressions';
import { ExternalQueries } from '../../third-parties';
import { fetchByCategory } from '../../third-parties/fetch-search-categories';

export const stubAdapters: ExternalQueries = {
  fetchByCategory,
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchEvaluationHumanReadableOriginalUrl: () => TE.right(new URL('https://example.com')),
  fetchEvaluationDigest: fetchEvaluation,
  fetchPublishingHistory,
  fetchRecommendedPapers,
  fetchSearchCategories,
  fetchStaticFile,
  fetchUserAvatarUrl: () => TE.right('/static/images/profile-dark.svg'),
  getArticleSubjectArea: () => TE.right({
    value: 'Biology',
    server: 'biorxiv',
  }),
  searchForPaperExpressions,
};
