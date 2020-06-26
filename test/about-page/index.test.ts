import { Context, Middleware, Response } from 'koa';
import createIndex, { FetchStaticFile } from '../../src/about-page/index';
import createContext from '../context';
import runMiddleware from '../middleware';

const fetchStaticFile: FetchStaticFile = async (filename) => (`# Contents of ${filename}`);

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(createIndex(fetchStaticFile), ctx, next);
  return response;
};

describe('render-about-page middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
  });

  it('inserts the HTML text into the response body', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.response.body).toStrictEqual(expect.stringContaining('<h1>Contents of about.md</h1>'));
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
