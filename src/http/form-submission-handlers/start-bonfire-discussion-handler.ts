import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { Logger } from '../../logger';
import { inputFieldNames } from '../../standards';
import { ExternalQueries } from '../../third-parties/external-queries';
import { ExpressionDoi, expressionDoiCodec } from '../../types/expression-doi';

type Dependencies = ExternalQueries & {
  logger: Logger,
};

const requestCodec = t.type({
  body: t.type({
    [inputFieldNames.expressionDoi]: expressionDoiCodec,
  }),
});

const submitStartBonfireDiscussion = (dependencies: Dependencies) => (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  dependencies.createBonfireDiscussionAndRetrieveDiscussionId,
);

export const startBonfireDiscussionHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const formRequest = requestCodec.decode(context.request);
  if (E.isLeft(formRequest)) {
    context.redirect('/action-failed');
    return;
  }

  const result = await pipe(
    formRequest.right.body[inputFieldNames.expressionDoi],
    submitStartBonfireDiscussion(dependencies),
  )();

  if (E.isLeft(result)) {
    context.redirect('/action-failed');
  }
};
