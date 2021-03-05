import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as A from 'fp-ts/Array';
import * as I from 'fp-ts/Identity';
import * as Ord from 'fp-ts/Ord';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { biorxivCache } from './biorxiv-cache';
import { commitEvents } from './commit-events';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { fetchCrossrefArticle } from './fetch-crossref-article';
import { fetchDataciteReview } from './fetch-datacite-review';
import { fetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { findReviewsForArticleDoi } from './find-reviews-for-article-doi';
import { follows } from './follows';
import { getArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { getEventsFromDataFiles } from './get-events-from-data-files';
import { getEventsFromDatabase } from './get-events-from-database';
import { getTwitterResponse } from './get-twitter-response';
import { getTwitterUserDetails } from './get-twitter-user-details';
import { getXmlFromCrossrefRestApi } from './get-xml-from-crossref-rest-api';
import { inMemoryEditorialCommunityRepository } from './in-memory-editorial-communities';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { responseCache } from './response-cache';
import { searchEuropePmc } from './search-europe-pmc';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { DomainEvent } from '../types/domain-events';

export const createInfrastructure = (): TE.TaskEither<unknown, Adapters> => pipe(
  I.Do,
  I.bind('logger', () => pipe(
    !!process.env.PRETTY_LOG,
    jsonSerializer,
    (serializer) => streamLogger(process.stdout, serializer),
    rTracerLogger,
  )),
  I.bind('pool', () => new Pool()),
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
  TE.bindW('eventsFromDataFiles', () => pipe(
    bootstrapEditorialCommunities,
    RNEA.map(({ id }) => id),
    getEventsFromDataFiles,
  )),
  TE.bindW('eventsFromDatabase', ({ pool, logger }) => getEventsFromDatabase(pool, logger)),
  TE.bindW('events', ({ eventsFromDataFiles, eventsFromDatabase }) => pipe(
    eventsFromDataFiles.concat(eventsFromDatabase),
    A.sort(Ord.contramap((event: DomainEvent) => event.date)(Ord.ordDate)),
    TE.right,
  )),
  TE.chain((adapters) => TE.tryCatch(
    async () => {
      const { events, logger, pool } = adapters;

      const getJson = async (uri: string) => {
        const response = await axios.get<Json>(uri);
        return response.data;
      };

      const retryingClient = axios.create();
      axiosRetry(retryingClient, {
        retryDelay: (count, error) => {
          logger('debug', 'Retrying HTTP request', { count, error });
          return 0;
        },
        retries: 3,
      });
      const getJsonWithRetries = async (uri: string) => {
        const response = await retryingClient.get<Json>(uri);
        return response.data;
      };

      const editorialCommunities = inMemoryEditorialCommunityRepository(bootstrapEditorialCommunities);
      const getAllEvents = T.of(events);
      const getFollowList = createEventSourceFollowListRepository(getAllEvents);

      return {
        fetchArticle: fetchCrossrefArticle(responseCache(getXmlFromCrossrefRestApi(logger), logger), logger),
        fetchReview: fetchReview(
          fetchDataciteReview(fetchDataset(logger), logger),
          fetchHypothesisAnnotation(getJson, logger),
          fetchNcrcReview(logger),
        ),
        fetchStaticFile: (...args) => fetchStaticFile(...args)(loggerIO(logger)),
        searchEuropePmc: searchEuropePmc(getJsonWithRetries, logger),
        editorialCommunities,
        getEditorialCommunity: editorialCommunities.lookup,
        getAllEditorialCommunities: editorialCommunities.all,
        findReviewsForArticleDoi: findReviewsForArticleDoi(getAllEvents),
        getAllEvents,
        commitEvents: (...args) => commitEvents(...args)({ inMemoryEvents: events, pool, logger: loggerIO(logger) }),
        getFollowList,
        getUserDetails: getTwitterUserDetails(
          getTwitterResponse(process.env.TWITTER_API_BEARER_TOKEN ?? '', logger),
          logger,
        ),
        follows: follows(getAllEvents),
        findVersionsForArticleDoi: biorxivCache(getArticleVersionEventsFromBiorxiv(getJson, logger), logger),
        ...adapters,
      };
    },
    identity,
  )),
);
