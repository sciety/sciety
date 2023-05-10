import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';
import { findVersionsForArticleDoi } from './find-versions-for-article-doi';
import { fetchReview } from './fetch-review';
import { fetchRelatedArticles } from './fetch-related-articles';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findVersionsForArticleDoi,
  fetchReview,
  fetchRecommendedPapers: fetchRelatedArticles,
};
