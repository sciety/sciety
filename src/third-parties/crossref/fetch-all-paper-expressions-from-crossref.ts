import { URL } from 'url';
import { formatValidationErrors } from 'io-ts-reporters';
import * as t from 'io-ts';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/string';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleVersion } from '../../types/article-version';
import { QueryExternalService } from '../query-external-service';
import * as DE from '../../types/data-error';
import { Logger } from '../../shared-ports';

const crossrefRecordCodec = t.strict({
  message: t.strict({
    DOI: t.string,
    posted: t.strict({
      'date-parts': t.readonlyArray(t.tuple([t.number, t.number, t.number])),
    }),
    resource: t.strict({
      primary: t.strict({
        URL: t.string,
      }),
    }),
    relation: t.partial({
      'has-version': t.array(t.strict({
        'id-type': t.literal('doi'),
        id: t.string,
      })),
      'is-version-of': t.array(t.strict({
        'id-type': t.literal('doi'),
        id: t.string,
      })),
    }),
  }),
});

export type CrossrefRecord = t.TypeOf<typeof crossrefRecordCodec>;

type QueryCrossrefService = ReturnType<QueryExternalService>;

const fetchIndividualRecord = (queryCrossrefService: QueryCrossrefService, logger: Logger) => (doi: string) => pipe(
  `https://api.crossref.org/works/${doi}`,
  queryCrossrefService,
  TE.chainEitherKW((response) => pipe(
    response,
    crossrefRecordCodec.decode,
    E.mapLeft((errors) => {
      logger('error', 'fetchIndividualRecord crossref codec failed', {
        doi,
        errors: formatValidationErrors(errors),
      });
      return errors;
    }),
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

const extractDoisOfRelatedExpressions = (record: CrossrefRecord) => [
  ...pipe(
    record.message.relation['is-version-of'] ?? [],
    RA.map((relation) => relation.id.toLowerCase()),
  ),
  ...pipe(
    record.message.relation['has-version'] ?? [],
    RA.map((relation) => relation.id.toLowerCase()),
  ),
];

type State = {
  queue: ReadonlyArray<string>,
  collectedRecords: Map<string, CrossrefRecord>,
};

const fetchAllQueuedRecordsAndAddToCollector = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (state: State) => pipe(
  state.queue,
  TE.traverseArray(fetchIndividualRecord(queryCrossrefService, logger)),
  TE.map((newlyFetchedRecords) => pipe(
    newlyFetchedRecords,
    RA.reduce(
      state.collectedRecords,
      (collectedRecords, newlyFetchedRecord) => {
        collectedRecords.set(newlyFetchedRecord.message.DOI.toLowerCase(), newlyFetchedRecord);
        return collectedRecords;
      },
    ),
    (collectedRecords) => ({
      queue: [],
      collectedRecords,
    }),
  )),
);

const hasNotBeenCollected = (state: State) => (doi: string) => !state.collectedRecords.has(doi);

export const enqueueAllRelatedDoisNotYetCollected = (state: State): State => pipe(
  Array.from(state.collectedRecords.values()),
  RA.chain(extractDoisOfRelatedExpressions),
  RA.uniq(S.Eq),
  RA.filter(hasNotBeenCollected(state)),
  (dois) => ({
    queue: dois,
    collectedRecords: state.collectedRecords,
  }),
);

const walkRelationGraph = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
  doi: string,
) => (
  state: State,
): TE.TaskEither<unknown, ReadonlyArray<CrossrefRecord>> => pipe(
  state,
  fetchAllQueuedRecordsAndAddToCollector(queryCrossrefService, logger),
  TE.map(enqueueAllRelatedDoisNotYetCollected),
  TE.chain((s) => {
    if (s.queue.length === 0) {
      return TE.right(Array.from(s.collectedRecords.values()));
    }
    if (s.collectedRecords.size > 20) {
      logger('warn', 'Exiting recursion early due to danger of an infinite loop', {
        collectedRecordsSize: s.collectedRecords.size,
        startingDoi: doi,
      });

      return TE.left(DE.unavailable);
    }
    return walkRelationGraph(queryCrossrefService, logger, doi)(s);
  }),
);

type FetchAllPaperExpressions = (queryCrossrefService: QueryCrossrefService, logger: Logger, doi: string)
=> TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressions = (
  queryCrossrefService,
  logger,
  doi,
) => pipe(
  {
    queue: [doi],
    collectedRecords: new Map(),
  },
  walkRelationGraph(queryCrossrefService, logger, doi),
  TO.fromTaskEither,
  TO.map(RA.map(toArticleVersion)),
  TO.chainOptionK(RNEA.fromReadonlyArray),
);