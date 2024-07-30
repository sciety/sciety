import { URL } from 'url';
import Router, { RouterParamContext } from '@koa/router';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { StatusCodes } from 'http-status-codes';
import {
  DefaultContext, DefaultState, Middleware, ParameterizedContext,
} from 'koa';
import { constructEvaluationContentUrl } from '../../src/read-side/construct-evaluation-content-url';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';

const dummyRouteHandler: Middleware = async (context, next) => {
  context.status = StatusCodes.OK;
  await next();
};

const dummyNext = async () => {};

type RouterContext = ParameterizedContext<
DefaultState, DefaultContext & RouterParamContext<DefaultState, DefaultContext>,
unknown>;

const createContextRequestingUrl = (url: URL) => createMockContext({ url: url.toString() }) as RouterContext;

describe('evaluation-content-path-spec', () => {
  const evaluationLocator = arbitraryEvaluationLocator();
  let ctx: RouterContext;

  beforeEach(async () => {
    const router = new Router();
    router.get('/evaluations/:reviewid(.*)/content', dummyRouteHandler);
    ctx = createContextRequestingUrl(constructEvaluationContentUrl(evaluationLocator));
    await router.middleware()(ctx, dummyNext);
  });

  it('handles slashes in locator', async () => {
    expect(ctx.status).toBe(200);
    expect(ctx.params).toStrictEqual({ reviewid: evaluationLocator });
  });
});
