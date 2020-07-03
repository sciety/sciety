import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { SEE_OTHER } from 'http-status-codes';
import { Next } from 'koa';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';
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
  editorialCommunities: EditorialCommunityRepository,
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

    const editorialCommunity = (await editorialCommunities.lookup(editorialcommunityid))
      .unwrapOrElse(() => {
        throw new BadRequest(`${editorialcommunityid} not found`);
      });

    await reviewReferenceRepository.add(
      new Doi(articleversiondoi),
      reviewDoi,
      editorialCommunity.id,
      new Date(),
    );

    response.redirect(`/articles/${articleversiondoi}`);
    response.status = SEE_OTHER;

    await next();
  }
);
