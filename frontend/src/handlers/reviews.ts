import { SEE_OTHER } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import parseBody from 'co-body';
import { BadRequest } from 'http-errors';
import { Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

const doiRegex = /^(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.[0-9]{4,}(?:\.[1-9][0-9]*)*\/(?:[^%"#?\s])+)$/;
const zenodoPrefix = '10.5281';

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async ({ request, response }: RouterContext, next: Next): Promise<void> => {
    const body: { articledoi: string; reviewdoi: string } = await parseBody.form(request.req);

    const [, reviewDoi] = doiRegex.exec(body.reviewdoi) || [];

    if (!reviewDoi) {
      throw new BadRequest('Not a possible DOI.');
    }

    if (!(reviewDoi.startsWith(`${zenodoPrefix}/`))) {
      throw new BadRequest('Not a Zenodo DOI.');
    }

    reviewReferenceRepository.add({ articleDoi: body.articledoi, reviewDoi });

    response.redirect(`/articles/${encodeURIComponent(body.articledoi)}`);
    response.status = SEE_OTHER;

    await next();
  }
);
