import { fetchStaticFile } from './fetch-static-file.js';
import { localFetchArticleAdapter } from './local-fetch-article-adapter.js';
import { searchEuropePmc } from './search-europe-pmc.js';
import { findVersionsForArticleDoi } from './find-versions-for-article-doi.js';
import { fetchReview } from './fetch-review.js';
import { fetchRelatedArticles } from './fetch-related-articles.js';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findVersionsForArticleDoi,
  fetchReview,
  fetchRelatedArticles,
};
