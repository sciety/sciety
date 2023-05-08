import { Middleware } from '@koa/router';
import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { commandCodec, commandHandler, Ports as CommandHandlerPorts } from './command-handler';
import * as RI from '../../types/evaluation-locator';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';

// ts-unused-exports:disable-next-line
export type Ports = GetLoggedInScietyUserPorts & CommandHandlerPorts;

const respondRequestCodec = t.type({
  body: t.type({
    reviewid: RI.evaluationLocatorCodec,
    command: commandCodec,
  }),
});

export const respondHandler = (ports: Ports): Middleware => async (context, next) => {
  const referrer = (context.request.headers.referer ?? '/') as string;
  const reviewIdOfRespondedToEvaluation: RI.EvaluationLocator = await pipe(
    context.request,
    respondRequestCodec.decode,
    O.fromEither,
    O.chain((request) => pipe(
      getLoggedInScietyUser(ports, context),
      O.map((userDetails) => ({
        reviewId: request.body.reviewid,
        command: request.body.command,
        userId: userDetails.id,
      })),
    )),
    O.fold(
      () => { throw new Error('respond handler received bad request'); },
      ({ reviewId, command, userId }) => pipe(
        { reviewId, command, userId },
        commandHandler(ports),
        TE.map(() => reviewId),
        TE.getOrElse((error) => { throw new Error(error); }),
      ),
    ),
  )();

  context.redirect(`${referrer}#${reviewIdOfRespondedToEvaluation}`);

  await next();
};
