import { assert, asyncProperty, lorem } from 'fast-check';
import { OK } from 'http-status-codes';
import { ExtendableContext, Middleware, Response } from 'koa';
import addPageTemplate from '../../src/middleware/add-page-template';
import runMiddleware from '../middleware';

const makeRequest = async (next?: Middleware): Promise<Response> => {
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

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();

    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
