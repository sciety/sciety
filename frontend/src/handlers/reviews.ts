import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { SEE_OTHER } from 'http-status-codes';
import parseBody from 'co-body';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (reviewReferenceRepository: ReviewReferenceRepository): Handler<HTTPVersion.V1> => (
  async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const body: { articledoi: string; reviewdoi: string } = await parseBody.form(request);

    reviewReferenceRepository.add({ articleDoi: body.articledoi, reviewDoi: body.reviewdoi });

    response.setHeader('Location', `/articles/${encodeURIComponent(body.articledoi)}`);
    response.writeHead(SEE_OTHER);
    response.end('');
  }
);
