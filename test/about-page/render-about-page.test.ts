import { Context, Middleware, Response } from 'koa';
import renderAboutPage from '../../src/about-page/render-about-page';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(renderAboutPage(), ctx, next);
  return response;
};

describe('render-about-page middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      markdown: '# About Xyz',
    };
  });

  it('inserts the HTML text into the response body', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.response.body).toStrictEqual(expect.stringContaining('<h1>About Xyz</h1>'));
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
