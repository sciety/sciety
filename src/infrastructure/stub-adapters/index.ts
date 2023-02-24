import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findVersionsForArticleDoi: () => T.of(O.none),
};
