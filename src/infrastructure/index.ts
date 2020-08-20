import axios from 'axios';
import { Adapters } from './adapters';
import createFetchCrossrefArticle from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createFilterEvents from './filter-events';
import createGetBiorxivCommentCount from './get-biorxiv-comment-count';
import createGetDisqusPostCount from './get-disqus-post-count';
import getEventsFromDataFiles from './get-events-from-data-files';
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
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { Json } from '../types/json';
import userId from '../types/user-id';

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
  const hardcodedFollowEvents: Array<DomainEvent> = [
    {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    },
    {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      type: 'EditorialCommunityJoined',
      date: new Date(),
      actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    },
    {
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
  ];
  const allEvents = events.concat(hardcodedFollowEvents);
  const reviewProjections = createReviewProjections(allEvents.filter(isEditorialCommunityReviewedArticleEvent));

  return {
    fetchArticle: createFetchCrossrefArticle(getXml, logger),
    getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson, logger), logger),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    endorsements: populateEndorsementsRepository(events),
    ...reviewProjections,
    filterEvents: createFilterEvents(allEvents),
    getAllEvents: async () => allEvents,
    logger,
  };
};

export default createInfrastructure;
