import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { fetchStaticFile } from './fetch-static-file';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import { searchEuropePmc } from './search-europe-pmc';

type ArticleVersionInformation = {
  source: URL,
  publishedAt: Date,
  version: number,
};

export const stubAdapters = {
  fetchArticle: localFetchArticleAdapter,
  fetchStaticFile,
  searchForArticles: searchEuropePmc,
  findVersionsForArticleDoi: () => T.of(O.some([
    {
      source: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
      publishedAt: new Date('1970'),
      version: 1,
    },
    {
      source: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
      publishedAt: new Date('1980'),
      version: 2,
    },
  ] as RNEA.ReadonlyNonEmptyArray<ArticleVersionInformation>)),
};
