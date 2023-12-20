import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';
import { fetchReview } from './fetch-review';
import { fetchRelatedArticles } from './fetch-related-articles';
import { localFetchPaperExpressionFrontMatter } from './local-fetch-paper-expression-front-matter';
import { findAllExpressionsOfPaper } from './find-all-expressions-of-paper';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchPaperExpressionFrontMatter: localFetchPaperExpressionFrontMatter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findAllExpressionsOfPaper,
  fetchReview,
  fetchRelatedArticles,
};
