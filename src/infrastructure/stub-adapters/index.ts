import * as TE from 'fp-ts/TaskEither';
import { fetchStaticFile } from './fetch-static-file.js';
import { searchForPaperExpressions } from './search-for-paper-expressions.js';
import { fetchEvaluation } from './fetch-evaluation.js';
import { fetchRecommendedPapers } from './fetch-recommended-papers.js';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter.js';
import { fetchPublishingHistory } from './fetch-publishing-history.js';
import { ExternalQueries } from '../../third-parties/index.js';

export const stubAdapters: ExternalQueries = {
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchStaticFile,
  searchForPaperExpressions,
  fetchPublishingHistory,
  fetchEvaluation,
  fetchRecommendedPapers,
  getArticleSubjectArea: () => TE.right({
    value: 'Biology',
    server: 'biorxiv',
  }),
};
