import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';
import { fetchReview } from './fetch-review';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { findAllExpressionsOfPaper } from './find-all-expressions-of-paper';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchPaperExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findAllExpressionsOfPaper,
  fetchReview,
  fetchRecommendedPapers,
};
