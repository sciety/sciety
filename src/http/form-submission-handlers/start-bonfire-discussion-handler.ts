import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
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
  TE.map(() => undefined),
);

export const startBonfireDiscussionHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const formRequest = requestCodec.decode(context.request);
  if (E.isLeft(formRequest)) {
    context.redirect('/action-failed');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await pipe(
    formRequest.right.body[inputFieldNames.expressionDoi],
    submitStartBonfireDiscussion(dependencies),
  )();
};
