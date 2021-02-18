import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as T from 'fp-ts/Task';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import { createBiorxivCache } from './biorxiv-cache';
import { createCommitEvents } from './commit-events';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { createFetchCrossrefArticle } from './fetch-crossref-article';
import { createFetchDataciteReview } from './fetch-datacite-review';
import { createFetchDataset } from './fetch-dataset';
import { createFetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { createFetchReview } from './fetch-review';
import { createFetchStaticFile } from './fetch-static-file';
import { findReviewsForArticleDoi } from './find-reviews-for-article-doi';
import { createFollows } from './follows';
import { getArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { getEventsFromDataFiles } from './get-events-from-data-files';
import { getEventsFromDatabase } from './get-events-from-database';
import { createGetTwitterResponse } from './get-twitter-response';
import { createGetTwitterUserDetails } from './get-twitter-user-details';
import { createGetXmlFromCrossrefRestApi } from './get-xml-from-crossref-rest-api';
import { createEditorialCommunityRepository } from './in-memory-editorial-communities';
import {
  createJsonSerializer, createRTracerLogger, createStreamLogger, Logger,
} from './logger';
import { responseCache } from './response-cache';
import { createSearchEuropePmc } from './search-europe-pmc';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';
import { Json } from '../types/json';

const populateEditorialCommunities = (logger: Logger): EditorialCommunityRepository => {
  const repository = createEditorialCommunityRepository(logger);
  for (const editorialCommunity of bootstrapEditorialCommunities) {
    void repository.add(editorialCommunity)();
  }
  return repository;
};

export const createInfrastructure = async (): Promise<Adapters> => {
  const logger = createRTracerLogger(
    createStreamLogger(
      process.stdout,
      createJsonSerializer(!!process.env.PRETTY_LOG),
    ),
  );

  const getJson = async (uri: string): Promise<Json> => {
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
  const getJsonWithRetries = async (uri: string): Promise<Json> => {
    const response = await retryingClient.get<Json>(uri);
    return response.data;
  };

  const getXmlFromCrossrefRestApi = createGetXmlFromCrossrefRestApi(logger);
  const fetchDataset = createFetchDataset(logger);
  const fetchDataciteReview = createFetchDataciteReview(fetchDataset, logger);
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, logger);
  const searchEuropePmc = createSearchEuropePmc(getJsonWithRetries, logger);
  const editorialCommunities = populateEditorialCommunities(logger);
  const pool = new Pool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id uuid,
      type varchar,
      date timestamp,
      payload jsonb,
      PRIMARY KEY (id)
    );
  `);
  const editorialCommunityIds = bootstrapEditorialCommunities.map(({ id }) => id.value);
  const events = getEventsFromDataFiles(editorialCommunityIds)
    .concat(await getEventsFromDatabase(pool, logger));
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  const getAllEvents = T.of(events);
  const getFollowList = createEventSourceFollowListRepository(getAllEvents);
  const getTwitterResponse = createGetTwitterResponse(process.env.TWITTER_API_BEARER_TOKEN ?? '', logger);

  return {
    fetchArticle: createFetchCrossrefArticle(responseCache(getXmlFromCrossrefRestApi, logger), logger),
    fetchReview: createFetchReview(
      fetchDataciteReview,
      fetchHypothesisAnnotation,
      fetchNcrcReview(logger),
    ),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    getEditorialCommunity: editorialCommunities.lookup,
    getAllEditorialCommunities: editorialCommunities.all,
    findReviewsForArticleDoi: findReviewsForArticleDoi(getAllEvents),
    getAllEvents,
    logger,
    commitEvents: createCommitEvents(events, pool, logger),
    getFollowList,
    getUserDetails: createGetTwitterUserDetails(getTwitterResponse, logger),
    follows: createFollows(getAllEvents),
    findVersionsForArticleDoi: createBiorxivCache(getArticleVersionEventsFromBiorxiv(getJson, logger), logger),
  };
};
