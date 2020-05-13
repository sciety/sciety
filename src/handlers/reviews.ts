import { SEE_OTHER } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import Doi from '../data/doi';
import { EditorialCommunity } from '../types/editorial-community';
import ReviewReferenceRepository from '../types/review-reference-repository';

const zenodoPrefix = '10.5281';

const validateDoi = (input: string): Doi => {
  try {
    return new Doi(input);
  } catch (err) {
    throw new BadRequest(err.toString());
  }
};

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  editorialCommunities: Array<EditorialCommunity>,
): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
    const {
      articleversiondoi,
      editorialcommunityid,
      reviewdoi,
    } = request.body;

    const reviewDoi = validateDoi(reviewdoi);
    if (!(reviewDoi.hasPrefix(zenodoPrefix))) {
      throw new BadRequest('Not a Zenodo DOI.');
    }

    const editorialCommunity = editorialCommunities.find((each) => each.id === editorialcommunityid);
    if (!editorialCommunity) {
      throw new BadRequest(`${editorialcommunityid} not found`);
    }

    reviewReferenceRepository.add(
      new Doi(articleversiondoi),
      reviewDoi,
      editorialCommunity.id,
    );

    response.redirect(`/articles/${articleversiondoi}`);
    response.status = SEE_OTHER;

    await next();
  }
);
