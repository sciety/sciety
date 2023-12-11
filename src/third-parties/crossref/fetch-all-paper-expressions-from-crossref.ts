import { URL } from 'url';
import * as t from 'io-ts';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleVersion } from '../../types/article-version';
import { QueryExternalService } from '../query-external-service';

const crossrefRecordCodec = t.strict({
  message: t.strict({
    DOI: t.string,
    posted: t.strict({
      'date-parts': t.readonlyArray(t.readonlyArray(t.number)),
    }),
    resource: t.strict({
      primary: t.strict({
        URL: t.string,
      }),
    }),
  }),
});

type CrossrefRecord = t.TypeOf<typeof crossrefRecordCodec>;

const fetchIndividualRecord = (queryCrossrefService: QueryExternalService) => (doi: string) => pipe(
  `https://api.crossref.org/works/${doi}`,
  queryCrossrefService(),
  TE.chainEitherKW((response) => pipe(
    response,
    crossrefRecordCodec.decode,
    E.mapLeft((e) => e),
  )),
);

const toArticleVersion = (crossrefExpression: CrossrefRecord): ArticleVersion => ({
  version: parseInt(crossrefExpression.message.DOI.substring(crossrefExpression.message.DOI.length - 1), 10),
  publishedAt: new Date(
    crossrefExpression.message.posted['date-parts'][0][0],
    crossrefExpression.message.posted['date-parts'][0][1] - 1,
    crossrefExpression.message.posted['date-parts'][0][2],
  ),
  source: new URL(crossrefExpression.message.resource.primary.URL),
});

type FetchAllPaperExpressions = (queryCrossrefService: QueryExternalService, doi: string)
=> TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressions = (queryCrossrefService) => pipe(
  [
    '10.1099/acmi.0.000667.v3',
    '10.1099/acmi.0.000667.v2',
    '10.1099/acmi.0.000667.v1',
  ],
  TE.traverseArray(fetchIndividualRecord(queryCrossrefService)),
  TO.fromTaskEither,
  TO.map(RA.map(toArticleVersion)),
  TO.chainOptionK(RNEA.fromReadonlyArray),
);
