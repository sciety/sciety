import { URL } from 'url';
import * as t from 'io-ts';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleVersion } from '../../types/article-version';

const crossrefRecordCodec = t.strict({
  message: t.strict({
    DOI: t.string,
    posted: t.strict({
      'date-parts': t.tuple([t.number, t.number, t.number]),
    }),
    resource: t.strict({
      primary: t.strict({
        URL: t.string,
      }),
    }),
  }),
});

type CrossrefRecord = t.TypeOf<typeof crossrefRecordCodec>;

const toArticleVersion = (crossrefExpression: CrossrefRecord): ArticleVersion => ({
  version: parseInt(crossrefExpression.message.DOI.substring(crossrefExpression.message.DOI.length - 1), 10),
  publishedAt: new Date(
    crossrefExpression.message.posted['date-parts'][0],
    crossrefExpression.message.posted['date-parts'][1] - 1,
    crossrefExpression.message.posted['date-parts'][2],
  ),
  source: new URL(crossrefExpression.message.resource.primary.URL),
});

type FetchAllPaperExpressionsFromCrossref = (doi: string) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressionsFromCrossref = () => pipe(
  [
    {
      version: 3,
      publishedAt: new Date('2023-12-08'),
      source: new URL('https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v3'),
    },
    pipe(
      {
        message: {
          DOI: '10.1099/acmi.0.000667.v2',
          posted: {
            'date-parts': [2023, 11, 2],
          },
          resource: {
            primary: {
              URL: 'https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v2',
            },
          },
        },
      },
      toArticleVersion,
    ),
    {
      version: 1,
      publishedAt: new Date('2023-07-06'),
      source: new URL('https://www.microbiologyresearch.org/content/journal/acmi/10.1099/acmi.0.000667.v1'),
    },
  ],
  RNEA.fromReadonlyArray,
  T.of,
);
