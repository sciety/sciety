import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
};
