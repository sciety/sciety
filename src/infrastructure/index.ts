import axios from 'axios';
import { Adapters } from './adapters';
import createFetchCrossrefArticle from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createGetBiorxivCommentCount from './get-biorxiv-comment-count';
import createGetDisqusPostCount from './get-disqus-post-count';
import createGetFollowList from './get-follow-list';
import createGetXml from './get-xml';
import createEditorialCommunityRepository from './in-memory-editorial-communities';
import createEndorsementsRepository from './in-memory-endorsements-repository';
import createReviewReferenceRepository from './in-memory-review-references';
import {
  createJsonSerializer, createRTracerLogger, createStreamLogger, Logger,
} from './logger';
import createSearchEuropePmc from './search-europe-pmc';
import bootstrapEditorialCommunities from '../data/bootstrap-editorial-communities';
import bootstrapEndorsements from '../data/bootstrap-endorsements';
import bootstrapReviews from '../data/bootstrap-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { Json } from '../types/json';
import { ReviewId } from '../types/review-id';
import ReviewReferenceRepository from '../types/review-reference-repository';

const populateEditorialCommunities = (logger: Logger): EditorialCommunityRepository => {
  const repository = createEditorialCommunityRepository(logger);
  for (const editorialCommunity of bootstrapEditorialCommunities) {
    void repository.add(editorialCommunity);
  }
  return repository;
};

const populateEndorsementsRepository = (logger: Logger): EndorsementsRepository => {
  const repository = createEndorsementsRepository(logger);
  for (const {
    article, editorialCommunity,
  } of bootstrapEndorsements) {
    void repository.add(new Doi(article), new EditorialCommunityId(editorialCommunity));
  }
  return repository;
};

const populateReviewReferenceRepository = (
  editorialCommunities: EditorialCommunityRepository,
  logger: Logger,
): ReviewReferenceRepository => {
  const repository = createReviewReferenceRepository(logger);
  for (const {
    article, review, editorialCommunityIndex, added,
  } of bootstrapReviews) {
    let reviewId: ReviewId;
    try {
      reviewId = new Doi(review);
    } catch {
      reviewId = new HypothesisAnnotationId(review);
    }
    void repository.add(
      new Doi(article),
      reviewId,
      editorialCommunities.all()[editorialCommunityIndex].id,
      added,
    );
  }
  return repository;
};

const getJson = async (uri: string): Promise<Json> => {
  const response = await axios.get<Json>(uri);
  return response.data;
};

const createInfrastructure = (): Adapters => {
  const logger = createRTracerLogger(
    createStreamLogger(
      process.stdout,
      createJsonSerializer(!!process.env.PRETTY_LOG),
    ),
  );
  const getXml = createGetXml();
  const fetchDataset = createFetchDataset(logger);
  const fetchDataciteReview = createFetchDataciteReview(fetchDataset, logger);
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, logger);
  const searchEuropePmc = createSearchEuropePmc(getJson, logger);
  const editorialCommunities = populateEditorialCommunities(logger);
  const getFollowList = createGetFollowList();

  return {
    fetchArticle: createFetchCrossrefArticle(getXml, logger),
    getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson, logger), logger),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(logger),
    searchEuropePmc,
    editorialCommunities,
    endorsements: populateEndorsementsRepository(logger),
    reviewReferenceRepository: populateReviewReferenceRepository(editorialCommunities, logger),
    getFollowList,
    logger,
  };
};

export default createInfrastructure;
