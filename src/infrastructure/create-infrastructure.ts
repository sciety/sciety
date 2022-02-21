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
import {
  byDate, isArticleAddedToListEvent,
} from '../domain-events';
import { executePolicies } from '../policies/execute-policies';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { getBiorxivOrMedrxivSubjectArea } from '../third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
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
        '456a4f53-1d97-465f-bff0-2694bc5a0a0c',
        'a14f55f7-3d13-48b8-bac1-3f7b756fcdcc',
        '73b9208d-ea98-4517-8f14-4a96a66006b1',
        '2b80797d-c436-4552-8153-b5304ecce861',
        '38d7fa5f-c79e-4b6c-8103-c04bdd336565',
        '4548ccb0-dbcd-4e61-abbf-f08d4d2faacc',
        '813976bc-3ed2-4923-9ce0-01d7ea91d3b6',
        '7dc8e93e-9191-4c92-a431-ddeb26d31059',
        '671d9df4-87b2-4ffc-876e-feb7f9fa6332',
        'e1449aab-5b95-4295-865c-5baa25aa2d13',
        'e440d3d3-efd7-4964-9c47-c39b5cdb4c00',
        'b56bb43a-1926-4d1a-a61b-ae531803a8d4',
        '9e770163-f00b-450d-b1f4-d5df273790d0',
        '141f3e61-b6ee-4fb5-8d9c-53fefb57cc00',
        '5ea3fd54-2b8b-45fc-8609-cd0162c0c8c4',
        '7790035c-23c2-4dc6-b23e-ee6b67c8a7cb'
      );
    `),
    identity,
  )),
  TE.chainW(({ pool, logger }) => pipe(
    {
      eventsFromDatabase: pipe(
        getEventsFromDatabase(pool, loggerIO(logger)),
        TE.chainW((events) => pipe(
          [],
          TE.right,
          TE.map(RA.filter(isArticleAddedToListEvent)),
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
          ],
          A.sort(byDate),
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

      const commitEventsWithoutListeners = commitEvents({ inMemoryEvents: events, pool, logger });
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
        commitEvents: (eventsToCommit) => pipe(
          eventsToCommit,
          commitEventsWithoutListeners,
          T.chainFirst(() => pipe(
            eventsToCommit,
            T.traverseArray(executePolicies({
              getAllEvents,
              logger,
              commitEvents: commitEventsWithoutListeners,
              getBiorxivOrMedrxivSubjectArea: getBiorxivOrMedrxivSubjectArea({ getJson, logger }),
            })),
          )),
        ),
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
