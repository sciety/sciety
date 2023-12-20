import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleVersion } from '../../types/article-version';
import { ExternalQueries } from '../../third-parties';

export const findAllExpressionsOfPaper: ExternalQueries['findAllExpressionsOfPaper'] = () => T.of(O.some([
  {
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v1'),
    publishedAt: new Date('1970'),
    version: 1,
  },
  {
    publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.08.20.504530v2'),
    publishedAt: new Date('1980'),
    version: 2,
  },
] as RNEA.ReadonlyNonEmptyArray<ArticleVersion>));
