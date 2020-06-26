import { Context, Middleware, Response } from 'koa';
import readFile from '../../src/about-page/read-file';
import { FetchStaticFile } from '../../src/infrastructure/fetch-static-file';
import createContext from '../context';
import runMiddleware from '../middleware';

const fetchStaticFile: FetchStaticFile = async (filename) => (`# Contents of ${filename}`);

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(readFile('abc.md', fetchStaticFile), ctx, next);
  return response;
};

describe('read-file middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
  });

  it('reads the file', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(await ctx.state.markdown).toStrictEqual('# Contents of abc.md');
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
