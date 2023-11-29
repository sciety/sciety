import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';
import { findVersionsForArticleDoi } from './find-versions-for-article-doi';
import { fetchReview } from './fetch-review';
import { fetchRelatedArticles } from './fetch-related-articles';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchPaperExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findVersionsForArticleDoi,
  findVersionInformationForAllPaperExpressions: findVersionsForArticleDoi,
  fetchReview,
  fetchRelatedArticles,
};
