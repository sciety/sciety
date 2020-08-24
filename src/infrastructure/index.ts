import axios from 'axios';
import { Adapters } from './adapters';
import createFetchCrossrefArticle from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createFilterEvents from './filter-events';
import createFollows from './follows';
import createGetBiorxivCommentCount from './get-biorxiv-comment-count';
import createGetDisqusPostCount from './get-disqus-post-count';
import getEventsFromDataFiles from './get-events-from-data-files';
import createGetXml from './get-xml';
import createEditorialCommunityRepository from './in-memory-editorial-communities';
import createEndorsementsRepository from './in-memory-endorsements-repository';
import {
  createJsonSerializer, createRTracerLogger, createStreamLogger, Logger,
} from './logger';
import createProjectFollowListForUser from './project-follow-list-for-user';
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

const createInfrastructure = (): Adapters => {
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
  const events = getEventsFromDataFiles();
  const reviewProjections = createReviewProjections(events.filter(isEditorialCommunityReviewedArticleEvent));
  const getFollowList = createProjectFollowListForUser(async () => events);

  return {
    fetchArticle: createFetchCrossrefArticle(getXml, logger),
    getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson, logger), logger),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    getEditorialCommunity: editorialCommunities.lookup,
    endorsements: populateEndorsementsRepository(events),
    ...reviewProjections,
    filterEvents: createFilterEvents(events),
    getAllEvents: async () => events,
    logger,
    commitEvent: async (event) => { events.push(event); },
    getFollowList,
    follows: createFollows(async () => events),
  };
};

export default createInfrastructure;
