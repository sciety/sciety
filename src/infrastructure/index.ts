import axios from 'axios';
import createFetchCrossrefArticle, { MakeHttpRequest } from './fetch-crossref-article';
import createFetchDataciteReview from './fetch-datacite-review';
import createFetchDataset from './fetch-dataset';
import createFetchHypothesisAnnotation from './fetch-hypothesis-annotation';
import createFetchReview from './fetch-review';
import createFetchStaticFile from './fetch-static-file';
import createGetBiorxivCommentCount from './get-biorxiv-comment-count';
import createGetDisqusPostCount from './get-disqus-post-count';
import createEditorialCommunityRepository from './in-memory-editorial-communities';
import createEndorsementsRepository from './in-memory-endorsements-repository';
import createReviewReferenceRepository from './in-memory-review-references';
import createSearchEuropePmc from './search-europe-pmc';
import bootstrapEndorsements from '../data/bootstrap-endorsements';
import bootstrapReviews from '../data/bootstrap-reviews';
import { createDebugLogger, createRTracerLogger, Logger } from '../logger';
import { Adapters } from '../types/adapters';
import Doi from '../types/doi';
import EndorsementsRepository from '../types/endorsements-repository';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';
import ReviewReferenceRepository from '../types/review-reference-repository';

const editorialCommunities = createEditorialCommunityRepository();

const populateEndorsementsRepository = (logger: Logger): EndorsementsRepository => {
  const repository = createEndorsementsRepository(logger);
  for (const {
    article, editorialCommunity,
  } of bootstrapEndorsements) {
    void repository.add(new Doi(article), editorialCommunity);
  }
  return repository;
};

const populateReviewReferenceRepository = (logger: Logger): ReviewReferenceRepository => {
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

const makeHttpRequest: MakeHttpRequest = async (uri, acceptHeader) => {
  const response = await axios.get(uri, { headers: { Accept: acceptHeader } });
  return response.data;
};

const getJson: Adapters['getJson'] = async (uri) => {
  const response = await axios.get(uri);
  return response.data;
};

const createInfrastructure = (): Adapters => {
  const logger = createRTracerLogger(createDebugLogger());
  const fetchDataset = createFetchDataset();
  const fetchDataciteReview = createFetchDataciteReview(fetchDataset);
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson);
  const searchEuropePmc = createSearchEuropePmc(getJson, logger);

  return {
    fetchArticle: createFetchCrossrefArticle(makeHttpRequest, logger),
    getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson)),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(),
    searchEuropePmc,
    editorialCommunities,
    endorsements: populateEndorsementsRepository(logger),
    reviewReferenceRepository: populateReviewReferenceRepository(logger),
    getJson,
    logger,
  };
};

export default createInfrastructure;
