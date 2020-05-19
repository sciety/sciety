import { Context, Middleware, Response } from 'koa';
import readFile from '../../src/about-page/read-file';
import { FetchStaticFile } from '../../src/api/fetch-static-file';
import createContext from '../context';
import runMiddleware from '../middleware';

const fetchStaticFile: FetchStaticFile = (filename: string): string => (`# Contents of ${filename}`);

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(readFile('abc.md', fetchStaticFile), ctx, next);
  return response;
};

describe('convert-markdown-to-html middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      markdown: '# Title',
    };
  });

  it('converts the markdown to HTML', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.markdown).toStrictEqual('# Contents of abc.md');
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
