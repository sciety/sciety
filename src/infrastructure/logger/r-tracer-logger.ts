import rTracer from 'cls-rtracer';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { Payload } from './types';
import { Logger } from '../../shared-ports';

export const rTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload) => pipe(
    O.of(rTracer.id()),
    O.match(
      constant(payload),
      (requestId) => ({ ...payload, requestId }),
    ),
  );

  return (level, message, payload = {}) => (
    logger(level, message, withRequestId(payload))
  );
};
