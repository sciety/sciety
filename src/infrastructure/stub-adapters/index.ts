import * as TE from 'fp-ts/TaskEither';
import { fetchStaticFile } from './fetch-static-file';
import { searchForPaperExpressions } from './search-for-paper-expressions';
import { fetchEvaluation } from './fetch-evaluation';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { ExternalQueries } from '../../third-parties';

export const stubAdapters: ExternalQueries = {
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchEvaluation,
  fetchPublishingHistory,
  fetchRecommendedPapers,
  fetchStaticFile,
  fetchUserAvatarUrl: () => TE.right('/static/images/profile-dark.svg'),
  getArticleSubjectArea: () => TE.right({
    value: 'Biology',
    server: 'biorxiv',
  }),
  searchForPaperExpressions,
};
