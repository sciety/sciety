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
import createReviewReferenceRepository from './in-memory-review-references';
import bootstrapReviews from '../data/bootstrap-reviews';
import { Logger } from '../logger';
import { Adapters } from '../types/adapters';
import Doi from '../types/doi';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';
import ReviewReferenceRepository from '../types/review-reference-repository';

const editorialCommunities = createEditorialCommunityRepository();

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

const createInfrastructure = (logger: Logger): Adapters => {
  const fetchDataset = createFetchDataset();
  const fetchDataciteReview = createFetchDataciteReview(fetchDataset);
  const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson);

  return {
    fetchArticle: createFetchCrossrefArticle(makeHttpRequest, logger),
    getBiorxivCommentCount: createGetBiorxivCommentCount(createGetDisqusPostCount(getJson)),
    fetchReview: createFetchReview(fetchDataciteReview, fetchHypothesisAnnotation),
    fetchStaticFile: createFetchStaticFile(),
    editorialCommunities,
    reviewReferenceRepository: populateReviewReferenceRepository(logger),
    getJson,
  };
};

export default createInfrastructure;
