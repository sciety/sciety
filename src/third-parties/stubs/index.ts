import { fetchRelatedArticles } from './fetch-related-articles';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { findVersionsForArticleDoi } from './find-versions-for-article-doi';
import { getArticleSubjectArea } from './get-article-subject-area';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';
import { ExternalQueries } from '../../types/external-queries';

export const stubAdapters: ExternalQueries = {
  fetchArticle: localFetchArticleAdapter,
  fetchRelatedArticles,
  fetchReview,
  fetchStaticFile,
  findVersionsForArticleDoi,
  getArticleSubjectArea,
  searchForArticles: searchEuropePmc,
};
