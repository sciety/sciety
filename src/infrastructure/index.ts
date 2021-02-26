import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as A from 'fp-ts/Array';
import * as Ord from 'fp-ts/Ord';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { createBiorxivCache } from './biorxiv-cache';
import { createCommitEvents } from './commit-events';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { createFetchCrossrefArticle } from './fetch-crossref-article';
import { fetchDataciteReview } from './fetch-datacite-review';
import { createFetchDataset } from './fetch-dataset';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { findReviewsForArticleDoi } from './find-reviews-for-article-doi';
import { createFollows } from './follows';
import { getArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { getEventsFromDataFiles } from './get-events-from-data-files';
import { getEventsFromDatabase } from './get-events-from-database';
import { createGetTwitterResponse } from './get-twitter-response';
import { createGetTwitterUserDetails } from './get-twitter-user-details';
import { createGetXmlFromCrossrefRestApi } from './get-xml-from-crossref-rest-api';
import { inMemoryEditorialCommunityRepository } from './in-memory-editorial-communities';
import { createJsonSerializer, createRTracerLogger, createStreamLogger } from './logger';
import { responseCache } from './response-cache';
import { createSearchEuropePmc } from './search-europe-pmc';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { DomainEvent } from '../types/domain-events';

export const createInfrastructure = (): TE.TaskEither<unknown, Adapters> => pipe(
  TE.Do,
  TE.bind('logger', () => pipe(
    !!process.env.PRETTY_LOG,
    createJsonSerializer,
    (serializer) => createStreamLogger(process.stdout, serializer),
    createRTracerLogger,
    TE.right,
  )),
  TE.bind('pool', () => pipe(new Pool(), TE.right)),
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
    RNEA.map(({ id }) => id.value),
    getEventsFromDataFiles,
  )),
  TE.bindW('eventsFromDatabase', ({ pool, logger }) => pipe(
    async () => getEventsFromDatabase(pool, logger),
    TE.rightTask,
  )),
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

      const getXmlFromCrossrefRestApi = createGetXmlFromCrossrefRestApi(logger);
      const fetchDataset = createFetchDataset(logger);
      const searchEuropePmc = createSearchEuropePmc(getJsonWithRetries, logger);
      const editorialCommunities = inMemoryEditorialCommunityRepository(bootstrapEditorialCommunities);
      const getAllEvents = T.of(events);
      const getFollowList = createEventSourceFollowListRepository(getAllEvents);
      const getTwitterResponse = createGetTwitterResponse(process.env.TWITTER_API_BEARER_TOKEN ?? '', logger);

      return {
        fetchArticle: createFetchCrossrefArticle(responseCache(getXmlFromCrossrefRestApi, logger), logger),
        fetchReview: fetchReview(
          fetchDataciteReview(fetchDataset, logger),
          fetchHypothesisAnnotation(getJson, logger),
          fetchNcrcReview(logger),
        ),
        fetchStaticFile: fetchStaticFile(logger),
        searchEuropePmc,
        editorialCommunities,
        getEditorialCommunity: editorialCommunities.lookup,
        getAllEditorialCommunities: editorialCommunities.all,
        findReviewsForArticleDoi: findReviewsForArticleDoi(getAllEvents),
        getAllEvents,
        commitEvents: createCommitEvents(events, pool, logger),
        getFollowList,
        getUserDetails: createGetTwitterUserDetails(getTwitterResponse, logger),
        follows: createFollows(getAllEvents),
        findVersionsForArticleDoi: createBiorxivCache(getArticleVersionEventsFromBiorxiv(getJson, logger), logger),
        ...adapters,
      };
    },
    identity,
  )),
);
