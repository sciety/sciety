import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as T from 'fp-ts/lib/Task';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import createBiorxivCache from './biorxiv-cache';
import createCommitEvents from './commit-events';
import createEventSourceFollowListRepository from './event-sourced-follow-list-repository';
import createFetchCrossrefArticle from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createFollows from './follows';
import createGetBiorxivArticleVersionEvents from './get-biorxiv-article-version-events';
import getEventsFromDataFiles from './get-events-from-data-files';
import getEventsFromDatabase from './get-events-from-database';
import createGetTwitterResponse from './get-twitter-response';
import createGetTwitterUserDetails from './get-twitter-user-details';
import createGetXmlFromCrossrefRestApi from './get-xml-from-crossref-rest-api';
import createEditorialCommunityRepository from './in-memory-editorial-communities';
import createEndorsementsRepository from './in-memory-endorsements-repository';
import {
  createJsonSerializer, createRTracerLogger, createStreamLogger, Logger,
} from './logger';
import { responseCache } from './response-cache';
import createReviewProjections from './review-projections';
import createSearchEuropePmc from './search-europe-pmc';
import bootstrapEditorialCommunities from '../data/bootstrap-editorial-communities';
import Doi from '../types/doi';
import { DomainEvent, isEditorialCommunityEndorsedArticleEvent, isEditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { generate } from '../types/event-id';
import { Json } from '../types/json';
import toUserId from '../types/user-id';

const populateEditorialCommunities = (logger: Logger): EditorialCommunityRepository => {
  const repository = createEditorialCommunityRepository(logger);
  for (const editorialCommunity of bootstrapEditorialCommunities) {
    void repository.add(editorialCommunity);
  }
  return repository;
};

const populateEndorsementsRepository = (
  events: ReadonlyArray<DomainEvent>,
): EndorsementsRepository => (
  createEndorsementsRepository(events.filter(isEditorialCommunityEndorsedArticleEvent))
);

const createInfrastructure = async (): Promise<Adapters> => {
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
    .concat(await getEventsFromDatabase(pool, logger))
    .concat([
      {
        id: generate(),
        type: 'UserSavedArticle',
        date: new Date(),
        userId: toUserId('1295307136415735808'),
        articleId: new Doi('10.1101/2020.07.04.187583'),
      },
      {
        id: generate(),
        type: 'UserSavedArticle',
        date: new Date(),
        userId: toUserId('1295307136415735808'),
        articleId: new Doi('10.1101/2020.09.09.289785'),
      },
    ]);
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  const getAllEvents = T.of(events);
  const reviewProjections = createReviewProjections(events.filter(isEditorialCommunityReviewedArticleEvent));
  const getFollowList = createEventSourceFollowListRepository(getAllEvents);
  const getTwitterResponse = createGetTwitterResponse(process.env.TWITTER_API_BEARER_TOKEN ?? '', logger);

  return {
    fetchArticle: createFetchCrossrefArticle(responseCache(getXmlFromCrossrefRestApi, logger), logger),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    getEditorialCommunity: editorialCommunities.lookup,
    getAllEditorialCommunities: editorialCommunities.all,
    endorsements: populateEndorsementsRepository(events),
    ...reviewProjections,
    getAllEvents,
    logger,
    commitEvents: createCommitEvents(events, pool, logger),
    getFollowList,
    getUserDetails: createGetTwitterUserDetails(getTwitterResponse, logger),
    follows: createFollows(getAllEvents),
    findVersionsForArticleDoi: createBiorxivCache(createGetBiorxivArticleVersionEvents(getJson, logger), logger),
  };
};

export default createInfrastructure;
