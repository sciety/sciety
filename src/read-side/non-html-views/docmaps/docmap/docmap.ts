import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Ports, generateDocmaps } from './generate-docmaps';
import { NonHtmlViewError, toNonHtmlViewError } from '../../non-html-view-error';
import { NonHtmlViewParams } from '../../non-html-view-params';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

const paramsCodec = t.strict({
  doi: t.string,
});

export const docmap = (
  ports: Ports,
) => (
  params: NonHtmlViewParams,
): TE.TaskEither<NonHtmlViewError, NonHtmlViewRepresentation> => pipe(
  params,
  paramsCodec.decode,
  E.mapLeft(() => toNonHtmlViewError(
    'Cannot understand the request',
    StatusCodes.BAD_REQUEST,
  )),
  TE.fromEither,
  TE.chain((decodedParams) => pipe(
    decodedParams.doi,
    generateDocmaps(ports),
  )),
  TE.map((state) => toNonHtmlViewRepresentation(state as Json, 'application/ld+json')),
);
