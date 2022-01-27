import { sequenceS } from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { commitEvents, writeEventToDatabase } from './commit-events';
import { fetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchData } from './fetchers';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { needsToBeAdded } from './needs-to-be-added';
import { bootstrapGroups } from '../data/bootstrap-groups';
import * as DomainEvent from '../domain-events';
import { isEvaluationRecordedEvent } from '../domain-events';
import { articleAddedToListEvents } from '../shared-read-models/lists/article-added-to-list-events';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { fetchCrossrefArticle } from '../third-parties/crossref';
import { fetchDataciteReview } from '../third-parties/datacite';
import { searchEuropePmc } from '../third-parties/europe-pmc';
import { fetchPrelightsHighlight } from '../third-parties/prelights';
import {
  getTwitterResponse, getTwitterUserDetails, getTwitterUserDetailsBatch, getTwitterUserId,
} from '../third-parties/twitter';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
  crossrefApiBearerToken: O.Option<string>,
  twitterApiBearerToken: string,
};

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, Adapters> => pipe(
  {
    logger: pipe(
      dependencies.prettyLog,
      jsonSerializer,
      (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
      rTracerLogger,
    ),
    pool: new Pool(),
  },
  TE.right,
  TE.chainFirst(({ pool }) => TE.tryCatch(
    async () => pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid,
        type varchar,
        date timestamp,
        payload jsonb,
        PRIMARY KEY (id)
      );
    `),
    identity,
  )),
  TE.chainFirst(({ pool }) => TE.tryCatch(
    async () => pool.query(`
      DELETE FROM events WHERE id IN (
                                      '2b318d10-c775-476d-8ec5-68e7b361044f',
                                      'b27b9d0d-20c6-4cb9-9068-27b673b68f7b',
                                      'e856e86b-4a3e-4d52-b42e-c19e758b60f4',
                                      '86308a1b-94ee-4885-bd18-375de711913d',
                                      '1f4f488f-5e23-4bc6-b684-cb09aac472a8',
                                      'e54d418f-0063-45d3-ab22-e72dd47fc48d',
                                      'dffebe32-4d7d-45de-bcd1-07a122ce2242',
                                      '44b36388-eeec-41ed-affe-4657630430d2',
                                      '6ddc2a06-6625-4aea-9750-bac5caaacd51',
                                      'e4bc120d-a3f6-454f-b06a-fc5c4feb7c13',
                                      '0fc7f646-6367-4698-bfd5-6c3dc256fa71',
                                      'c8a45226-7603-443c-82b1-8c43448416dc',
                                      '959c4102-dbb8-4db4-9a05-cdaac693f5a1',
                                      '9943970f-576b-4b49-b552-13354a7de38a',
                                      '183f067b-9118-42dd-aa89-34b94be111a2',
                                      'f471a747-a581-4ef4-b115-d526ed3592dd',
                                      '178d0eb6-cbb4-4adb-a6ae-8210bde147e7',
                                      'c1dd7a11-3e9c-4c4e-82c6-770011e0e743',
                                      '2d24dbf7-e642-4bcd-a7f0-2a9ac66d8a0c',
                                      '502dfa1d-ea4d-4bd7-93d9-f87a34a8b601',
                                      'a565f28c-6979-4280-8017-3862bbed4cd7',
                                      'b1575ba9-bd8f-4be0-8086-99abf6a96928',
                                      'b1af0742-c1db-4693-9a13-8a4549fc92a0',
                                      'e2de987e-e8eb-4ba9-ae9a-3d2f2be50d5c',
                                      '0af385cc-85d1-462a-8852-adec859ce182',
                                      'ccf2e57f-664b-426e-96d0-5f3c182ce409',
                                      'edeffd15-4fc3-4bf2-936a-d6fdb1b55794',
                                      'e3db6866-6eb6-42cc-971c-169d5e06cbed',
                                      '97bb0655-b059-422a-b1c1-32e00f1322a0',
                                      '48dbf38f-3c62-412c-88b3-42a222c55a96',
                                      'e471563f-d8f2-4ec9-baa4-14c2a15c55de',
                                      'acf092ae-00c9-40c7-9ca8-bba4860ec274',
                                      'b83ca6fe-9b5f-4fec-bc30-82e9c46686d8',
                                      'a2ecb4a1-660a-48fd-a926-8812c9950e8e',
                                      'ec9a9a1a-ae3c-4d2a-affd-4f0400257b8a',
                                      'cda2f607-60c0-4cac-b764-c28a0be9fe14'
      );
    `),
    identity,
  )),
  TE.chainW(({ pool, logger }) => pipe(
    {
      eventsFromDatabase: pipe(
        getEventsFromDatabase(pool, loggerIO(logger)),
        TE.chainW((events) => pipe(
          TE.right([]),
          TE.map(RA.filter(isEvaluationRecordedEvent)),
          TE.map(RA.filter(needsToBeAdded(events))),
          TE.chainFirstTaskK(T.traverseArray(writeEventToDatabase(pool))),
          TE.map((eventsToAdd) => [
            ...events,
            ...eventsToAdd,
          ]),
        )),
      ),
      groupEvents: pipe(
        bootstrapGroups,
        TE.right,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.map(({ eventsFromDatabase, groupEvents }) => (
      {
        events: pipe(
          [
            ...eventsFromDatabase,
            ...groupEvents,
            ...listCreationEvents,
            ...articleAddedToListEvents,
          ],
          A.sort(DomainEvent.byDate),
        ),
        pool,
        logger,
      }
    )),
  )),
  TE.chain((adapters) => TE.tryCatch(
    async () => {
      const { events, logger, pool } = adapters;

      const getJson = async (uri: string) => {
        const response = await fetchData(logger)<Json>(uri);
        return response.data;
      };

      const getAllEvents = T.of(events);
      const fetchFile = fetchStaticFile(loggerIO(logger));
      const fetchers = {
        doi: fetchDataciteReview(fetchDataset(logger), logger),
        hypothesis: fetchHypothesisAnnotation(getJson, logger),
        ncrc: fetchNcrcReview(logger),
        prelights: fetchPrelightsHighlight(getHtml(logger)),
        rapidreviews: fetchRapidReview(logger, getHtml(logger)),
      };

      return {
        fetchArticle: fetchCrossrefArticle(
          getCachedAxiosRequest(logger),
          logger,
          dependencies.crossrefApiBearerToken,
        ),
        fetchReview: fetchReview(fetchers),
        fetchStaticFile: fetchFile,
        searchEuropePmc: searchEuropePmc({ getJson, logger }),
        getAllEvents,
        commitEvents: commitEvents({ inMemoryEvents: events, pool, logger: loggerIO(logger) }),
        getUserDetails: getTwitterUserDetails(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserDetailsBatch: getTwitterUserDetailsBatch(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserId: getTwitterUserId(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
          getJson: getCachedAxiosRequest(logger),
          logger,
        }),
        ...adapters,
      };
    },
    identity,
  )),
);
