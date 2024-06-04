import * as E from 'fp-ts/Either';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { ParameterizedContext } from 'koa';
import { Logger } from '../../shared-ports';
import { UserId } from '../../types/user-id';
import { sendDefaultErrorHtmlResponse, Dependencies as SendDefaultErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export type Dependencies = SendDefaultErrorHtmlResponseDependencies & { logger: Logger };

export const decodeFormSubmission = <C>(
  dependencies: Dependencies,
  context: ParameterizedContext,
  codec: t.Decoder<unknown, C>,
  loggedInUserId: UserId,
): E.Either<unknown, C> => {
  const decodedForm = codec.decode(context.request.body);
  if (E.isLeft(decodedForm)) {
    dependencies.logger('error', 'Failed to decode a form submission', {
      codec: codec.name,
      codecDecodingError: PR.failure(decodedForm.left),
      requestBody: context.request.body,
      loggedInUserId,
    });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Form submission failed unexpectedly.');
  }
  return decodedForm;
};
