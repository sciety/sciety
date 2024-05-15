import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Docmap } from './docmap-type';
import { Ports, generateDocmaps } from './generate-docmaps';
import { NonHtmlViewError } from '../../non-html-view-error';
import { NonHtmlViewParams } from '../../non-html-view-params';

const paramsCodec = t.strict({
  doi: t.string,
});

export const docmap = (
  ports: Ports,
) => (
  params: NonHtmlViewParams,
): TE.TaskEither<NonHtmlViewError, ReadonlyArray<Docmap>> => pipe(
  params,
  paramsCodec.decode,
  E.mapLeft(() => ({ status: StatusCodes.BAD_REQUEST, message: 'Cannot understand the request' })),
  TE.fromEither,
  TE.chain((decodedParams) => generateDocmaps(ports)(decodedParams.doi)),
);
