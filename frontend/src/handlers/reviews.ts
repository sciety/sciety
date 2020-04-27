import { IncomingMessage, ServerResponse } from 'http';
import { Handler, HTTPVersion } from 'find-my-way';
import { BAD_REQUEST, SEE_OTHER } from 'http-status-codes';
import parseBody from 'co-body';
import ReviewReferenceRepository from '../types/review-reference-repository';

const doiRegex = /^(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.[0-9]{4,}(?:\.[1-9][0-9]*)*\/(?:[^%"#?\s])+)$/;
const zenodoPrefix = '10.5281';

export default (reviewReferenceRepository: ReviewReferenceRepository): Handler<HTTPVersion.V1> => (
  async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const body: { articledoi: string; reviewdoi: string } = await parseBody.form(request);

    const [, reviewDoi] = doiRegex.exec(body.reviewdoi) || [];

    if (!reviewDoi) {
      response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      response.writeHead(BAD_REQUEST);
      response.end('Not a possible DOI.');

      return;
    }

    if (!(reviewDoi.startsWith(`${zenodoPrefix}/`))) {
      response.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      response.writeHead(BAD_REQUEST);
      response.end('Not a Zenodo DOI.');

      return;
    }

    reviewReferenceRepository.add({ articleDoi: body.articledoi, reviewDoi });

    response.setHeader('Location', `/articles/${encodeURIComponent(body.articledoi)}`);
    response.writeHead(SEE_OTHER);
    response.end('');
  }
);
