import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createGetHardcodedRecommendations, { GetRecommendationContent } from './get-hardcoded-recommendations';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, {
  GetArticleDetails,
  GetCommentCount,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderPageHeader,
} from './render-page-header';
import createRenderRecommendations from './render-recommendations';
import createRenderReview, {
  GetEditorialCommunityName as GetEditorialCommunityNameForRenderReview,
  GetReview,
} from './render-review';
import createRenderReviews, { GetReviews, RenderReviews } from './render-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  getBiorxivCommentCount: GetCommentCount;
  fetchReview: GetReview;
  getEditorialCommunity: GetEditorialCommunity,
  endorsements: EndorsementsRepository,
  findReviewsForArticleVersionDoi: GetReviews;
}

const reviewsId = 'reviews';

type GetEditorialCommunityName = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => {
  const getArticleDetailsAdapter: GetArticleDetails = ports.fetchArticle;
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await ports.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap().name
  );
  const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async (doi) => (
    Promise.all((await ports.endorsements.endorsingEditorialCommunityIds(doi)).map(getEditorialCommunityName))
  );
  return createRenderPageHeader(
    getArticleDetailsAdapter,
    reviewCountAdapter,
    ports.getBiorxivCommentCount,
    getEndorsingEditorialCommunityNames,
    `#${reviewsId}`,
  );
};

const buildRenderAbstract = (fetchAbstract: FetchExternalArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi);
    return fetchedArticle.map((article) => ({ content: article.abstract }));
  };
  return createRenderArticleAbstract(abstractAdapter);
};

const buildRenderReviews = (ports: Ports): RenderReviews => {
  const getEditorialCommunityName: GetEditorialCommunityNameForRenderReview = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap().name
  );

  const renderReview = createRenderReview(ports.fetchReview, getEditorialCommunityName, 1500);
  return createRenderReviews(
    renderReview,
    ports.findReviewsForArticleVersionDoi,
    reviewsId,
  );
};

interface Params {
  doi?: string;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
  const getRecommendationContent: GetRecommendationContent = async () => `
    Sequencing and analyzing SARS-Cov-2 genomes in nearly real time has the potential
    to quickly confirm (and inform) our knowledge of, and response to, the current pandemic 
    [1,2]. In this manuscript [3], Danesh and colleagues use the earliest set of
    available SARS-Cov-2 genome sequences available from France to make inferences
    about the timing of the major epidemic wave, the duration of infections,
     and the efficacy of lockdown measures. Their phylodynamic estimates -- based on
    fitting genomic data to molecular clock and transmission models -- are reassuringly 
    close to estimates based on 'traditional' epidemiological methods: the French 
    epidemic likely began in mid-January or early February 2020, and spread relatively 
    rapidly (doubling every 3-5 days), with people remaining infectious for a median 
    of 5 days [4,5]. These transmission parameters are broadly in line with estimates 
    from China [6,7], but are currently unknown in France (in the absence of contact 
    tracing data). By estimating the temporal reproductive number (Rt), the authors 
    detected a slowing down of the epidemic in the most recent period of the study, 
    after mid-March, supporting the efficacy of lockdown measures. 
  `;
  const getRecommendations = createGetHardcodedRecommendations(getRecommendationContent);
  const renderRecommendations = createRenderRecommendations(getRecommendations);
  const renderReviews = buildRenderReviews(ports);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderRecommendations,
    renderReviews,
    renderAbstract,
  );
  return async (params) => {
    let doi: Doi;
    try {
      doi = ensureBiorxivDoi(params.doi ?? '').unsafelyUnwrap();
    } catch (error) {
      return Result.err({
        type: 'not-found',
        content: `${params.doi ?? 'Article'} not found`,
      });
    }
    return renderPage(doi);
  };
};
