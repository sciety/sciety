import { SEE_OTHER } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import Doi from '../data/doi';
import editorialCommunities from '../data/editorial-communities';
import ReviewReferenceRepository from '../types/review-reference-repository';

const zenodoPrefix = '10.5281';

const validateDoi = (input: string): Doi => {
  try {
    return new Doi(input);
  } catch (err) {
    throw new BadRequest(err.toString());
  }
};

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
    const { articleversiondoi, reviewdoi } = request.body;

    const reviewDoi = validateDoi(reviewdoi);

    if (!(reviewDoi.hasPrefix(zenodoPrefix))) {
      throw new BadRequest('Not a Zenodo DOI.');
    }

    reviewReferenceRepository.add(
      new Doi(articleversiondoi),
      reviewDoi,
      editorialCommunities[0].id,
      editorialCommunities[0].name,
    );

    response.redirect(`/articles/${articleversiondoi}`);
    response.status = SEE_OTHER;

    await next();
  }
);
