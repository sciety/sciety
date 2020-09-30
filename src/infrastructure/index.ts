import axios from 'axios';
import { Pool } from 'pg';
import { Adapters } from './adapters';
import createArticleCache from './article-cache';
import createCommitEvents from './commit-events';
import createEventSourceFollowListRepository from './event-sourced-follow-list-repository';
import createFetchCrossrefArticle from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createFollows from './follows';
import getEventsFromDataFiles from './get-events-from-data-files';
import getEventsFromDatabase from './get-events-from-database';
import createGetTwitterResponse from './get-twitter-response';
import createGetTwitterUserDetails from './get-twitter-user-details';
import createGetXml from './get-xml';
import createEditorialCommunityRepository from './in-memory-editorial-communities';
import createEndorsementsRepository from './in-memory-endorsements-repository';
import {
  createJsonSerializer, createRTracerLogger, createStreamLogger, Logger,
} from './logger';
import createReviewProjections from './review-projections';
import createSearchEuropePmc from './search-europe-pmc';
import bootstrapEditorialCommunities from '../data/bootstrap-editorial-communities';
import { DomainEvent, isEditorialCommunityEndorsedArticleEvent, isEditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { Json } from '../types/json';

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
  const getXml = createGetXml();
  const fetchDataset = createFetchDataset(logger);
  const fetchDataciteReview = createFetchDataciteReview(fetchDataset, logger);
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, logger);
  const searchEuropePmc = createSearchEuropePmc(getJson, logger);
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
  const events = getEventsFromDataFiles().concat(await getEventsFromDatabase(pool, logger));
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
  const getAllEvents: GetAllEvents = async () => events;
  const reviewProjections = createReviewProjections(events.filter(isEditorialCommunityReviewedArticleEvent));
  const getFollowList = createEventSourceFollowListRepository(getAllEvents);
  const getTwitterResponse = createGetTwitterResponse(process.env.TWITTER_API_BEARER_TOKEN ?? '');

  return {
    fetchArticle: createArticleCache(createFetchCrossrefArticle(getXml, logger), logger),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    getEditorialCommunity: editorialCommunities.lookup,
    endorsements: populateEndorsementsRepository(events),
    ...reviewProjections,
    getAllEvents,
    logger,
    commitEvents: createCommitEvents(events, pool, logger),
    getFollowList,
    getUserDetails: createGetTwitterUserDetails(getTwitterResponse, logger),
    follows: createFollows(getAllEvents),
  };
};

export default createInfrastructure;
