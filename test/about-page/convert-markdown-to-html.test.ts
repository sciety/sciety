import { Context, Middleware, Response } from 'koa';
import convertMarkdownToHtml from '../../src/about-page/convert-markdown-to-html';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(convertMarkdownToHtml(), ctx, next);
  return response;
};

describe('convert-markdown-to-html middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      markdown: Promise.resolve('# Title'),
    };
  });

  it('converts the markdown to HTML', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.html).toStrictEqual('<h1>Title</h1>');
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
