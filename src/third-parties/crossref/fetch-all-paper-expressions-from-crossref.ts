import { URL } from 'url';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleVersion } from '../../types/article-version';

type FetchAllPaperExpressionsFromCrossref = () => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressionsFromCrossref = () => pipe(
  [
    {
      version: 3,
      publishedAt: new Date('2023-12-08'),
      source: new URL('https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v3'),
    },
    {
      version: 2,
      publishedAt: new Date('2023-11-02'),
      source: new URL('https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v2'),
    },
    {
      version: 1,
      publishedAt: new Date('2023-07-06'),
      source: new URL('https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v1'),
    },
  ],
  RNEA.fromReadonlyArray,
  T.of,
);
