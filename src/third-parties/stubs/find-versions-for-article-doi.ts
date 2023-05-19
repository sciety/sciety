import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ExternalQueries } from '../../types/external-queries';

type ArticleVersionInformation = {
  source: URL,
  publishedAt: Date,
  version: number,
};

export const findVersionsForArticleDoi: ExternalQueries['findVersionsForArticleDoi'] = () => T.of(O.some([
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
] as RNEA.ReadonlyNonEmptyArray<ArticleVersionInformation>));
