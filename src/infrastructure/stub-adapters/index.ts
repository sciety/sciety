import * as TE from 'fp-ts/TaskEither';
import { fetchStaticFile } from './fetch-static-file';
import { searchForPaperExpressions } from './search-for-paper-expressions';
import { fetchReview } from './fetch-review';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { findAllExpressionsOfPaper } from './find-all-expressions-of-paper';
import { ExternalQueries } from '../../third-parties';

export const stubAdapters: ExternalQueries = {
  fetchExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchStaticFile,
  searchForPaperExpressions,
  findAllExpressionsOfPaper,
  fetchReview,
  fetchRecommendedPapers,
  getArticleSubjectArea: () => TE.right({
    value: 'Biology',
    server: 'biorxiv',
  }),
};
