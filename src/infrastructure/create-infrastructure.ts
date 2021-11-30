import { sequenceS } from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { commitEvents } from './commit-events';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { fetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchData } from './fetchers';
import { findGroups } from './find-groups';
import { follows } from './follows';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDataFiles } from './get-events-from-data-files';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import { inMemoryGroupRepository } from './in-memory-groups';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { bootstrapGroups } from '../data/bootstrap-groups';
import * as DomainEvent from '../domain-events';
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
  TE.chain(({ pool, logger }) => pipe(
    {
      eventsFromDatabase: getEventsFromDatabase(pool, loggerIO(logger)),
      eventsFromDataFiles: pipe(
        bootstrapGroups,
        RNEA.map(({ id }) => id),
        getEventsFromDataFiles,
      ),
      groupEvents: pipe(
        bootstrapGroups,
        RNEA.map((group) => DomainEvent.groupCreated(group)),
        TE.right,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.map(({ eventsFromDataFiles, eventsFromDatabase, groupEvents }) => (
      {
        events: pipe(
          [
            ...eventsFromDataFiles,
            ...eventsFromDatabase,
            ...groupEvents,
            ...listCreationEvents,
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

      const groups = inMemoryGroupRepository(bootstrapGroups);
      const getAllEvents = T.of(events);
      const getFollowList = createEventSourceFollowListRepository(getAllEvents);
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
        findGroups: findGroups(fetchFile, bootstrapGroups),
        searchEuropePmc: searchEuropePmc({ getJson, logger }),
        getAllGroups: groups.all,
        getAllEvents,
        commitEvents: commitEvents({ inMemoryEvents: events, pool, logger: loggerIO(logger) }),
        getFollowList,
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
        follows: follows(getAllEvents),
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
