import { URL } from 'url';
import * as t from 'io-ts';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/string';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
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

type CrossrefRecord = t.TypeOf<typeof crossrefRecordCodec>;

const fetchIndividualRecord = (queryCrossrefService: QueryExternalService) => (doi: string) => pipe(
  `https://api.crossref.org/works/${doi}`,
  queryCrossrefService(),
  TE.chainEitherKW((response) => pipe(
    response,
    crossrefRecordCodec.decode,
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
    RA.map((relation) => relation.id),
  ),
  ...pipe(
    record.message.relation['has-version'] ?? [],
    RA.map((relation) => relation.id),
  ),
];

type State = {
  queue: ReadonlyArray<string>,
  collectedRecords: Map<string, CrossrefRecord>,
};

const fetchAllQueuedRecordsAndAddToCollector = (queryCrossrefService: QueryExternalService) => (state: State) => pipe(
  state.queue,
  TE.traverseArray(fetchIndividualRecord(queryCrossrefService)),
  TE.map((newlyFetchedRecords) => pipe(
    newlyFetchedRecords,
    RA.reduce(
      state.collectedRecords,
      (collectedRecords, newlyFetchedRecord) => {
        collectedRecords.set(newlyFetchedRecord.message.DOI, newlyFetchedRecord);
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

const enqueueAllRelatedDoisNotYetCollected = (state: State): State => pipe(
  Array.from(state.collectedRecords.values()),
  RA.chain(extractDoisOfRelatedExpressions),
  RA.uniq(S.Eq),
  RA.filter(hasNotBeenCollected(state)),
  (dois) => ({
    queue: dois,
    collectedRecords: state.collectedRecords,
  }),
);

const walkRelationGraph = (queryCrossrefService: QueryExternalService) => (state: State) => pipe(
  state,
  fetchAllQueuedRecordsAndAddToCollector(queryCrossrefService),
  TE.map(enqueueAllRelatedDoisNotYetCollected),
  TE.chain((s) => TE.traverseArray(fetchIndividualRecord(queryCrossrefService))(s.queue)),
);

type FetchAllPaperExpressions = (queryCrossrefService: QueryExternalService, doi: string)
=> TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressions = (queryCrossrefService, doi) => pipe(
  {
    queue: [doi],
    collectedRecords: new Map(),
  },
  walkRelationGraph(queryCrossrefService),
  TO.fromTaskEither,
  TO.map(RA.map(toArticleVersion)),
  TO.chainOptionK(RNEA.fromReadonlyArray),
);
