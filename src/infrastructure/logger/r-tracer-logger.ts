import rTracer from 'cls-rtracer';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { Payload, Logger } from './types.js';

export const rTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload) => pipe(
    O.of(rTracer.id()),
    O.fold(
      constant(payload),
      (requestId) => ({ ...payload, requestId }),
    ),
  );

  return (level, message, payload = {}) => (
    logger(level, message, withRequestId(payload))
  );
};
