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
import { fetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchData } from './fetchers';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDataFiles } from './get-events-from-data-files';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { bootstrapGroups } from '../data/bootstrap-groups';
import * as DomainEvent from '../domain-events';
import { evaluationRecorded } from '../domain-events';
import { listCreationEvents } from '../shared-read-models/lists/list-creation-data';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { fetchCrossrefArticle } from '../third-parties/crossref';
import { fetchDataciteReview } from '../third-parties/datacite';
import { searchEuropePmc } from '../third-parties/europe-pmc';
import { fetchPrelightsHighlight } from '../third-parties/prelights';
import {
  getTwitterResponse, getTwitterUserDetails, getTwitterUserDetailsBatch, getTwitterUserId,
} from '../third-parties/twitter';
import { Doi } from '../types/doi';
import * as Gid from '../types/group-id';
import { ReviewId } from '../types/review-id';
import { articleAddedToListEvents } from '../shared-read-models/lists/article-added-to-list-events';

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
            ...articleAddedToListEvents,
            evaluationRecorded(
              Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
              new Doi('10.21203/rs.3.rs-955726/v1'),
              'hypothesis:iDLPjF9BEeyhWi89_nqmpA' as ReviewId,
              [],
              new Date('2021-12-17 13:59Z'),
              new Date('2021-12-21 10:31Z'),
            ),
            evaluationRecorded(
              Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
              new Doi('10.21203/rs.3.rs-885194/v1'),
              'ncrc:671d41ca-c8cd-44a3-afd5-c2ebe40a1316' as ReviewId,
              [],
              new Date('2021-11-15 00:00Z'),
              new Date('2021-12-21 13:53Z'),
            ),
            evaluationRecorded(
              Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
              new Doi('10.21203/rs.3.rs-871965/v1'),
              'ncrc:31f1797b-2835-4e00-81cd-3978ae770359' as ReviewId,
              [],
              new Date('2021-11-15 00:00Z'),
              new Date('2021-12-21 13:53Z'),
            ),
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
