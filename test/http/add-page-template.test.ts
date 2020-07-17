import { assert, asyncProperty, lorem } from 'fast-check';
import { OK } from 'http-status-codes';
import { ExtendableContext, Middleware, Response } from 'koa';
import runMiddleware from './middleware';
import addPageTemplate from '../../src/http/add-page-template';

const defaultNext: Middleware = async ({ response }) => {
  response.body = '';
};

const makeRequest = async (next = defaultNext): Promise<Response> => {
  const { response } = await runMiddleware(addPageTemplate(), undefined, next);

  return response;
};

describe('add-page-template middleware', (): void => {
  it('returns a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(OK);
  });

  it('returns HTML', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.type).toBe('text/html');
  });

  it('has an HTML5 body', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.body).toStrictEqual(expect.stringMatching(/^<!doctype html>/i));
  });

  it('includes existing body content', async (): Promise<void> => (
    assert(asyncProperty(lorem(), async (body: string) => {
      const next = async ({ response }: ExtendableContext): Promise<void> => {
        response.body = body;
      };

      const response = await makeRequest(next);

      expect(response.body).toStrictEqual(expect.stringContaining(body));
    }))
  ));
});
