import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { Logger } from '../../logger';
import { inputFieldNames } from '../../standards';
import { ExpressionDoi, expressionDoiCodec } from '../../types/expression-doi';

type Dependencies = {
  logger: Logger,
};

const requestCodec = t.type({
  body: t.type({
    [inputFieldNames.expressionDoi]: expressionDoiCodec,
  }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitStartBonfireDiscussion = (expressionDoi: ExpressionDoi) => undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const startBonfireDiscussionHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const formRequest = requestCodec.decode(context.request);
  if (E.isLeft(formRequest)) {
    context.redirect('/action-failed');
    return;
  }

  submitStartBonfireDiscussion(formRequest.right.body[inputFieldNames.expressionDoi]);
};
