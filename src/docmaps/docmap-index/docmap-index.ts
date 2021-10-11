import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Errors } from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { generateDocmapDois, Ports as GenerateDocmapDoisPorts, paramsCodec } from './generate-docmap-dois';
import { docmap, Ports as DocmapPorts } from '../docmap/docmap';

type Ports = DocmapPorts & GenerateDocmapDoisPorts;

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

type DocmapIndex = (ports: Ports) => (query: unknown) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

const avoidRateLimitingWithDummyValues = (ports: Ports): Ports => ({
  ...ports,
  fetchReview: () => TE.right({
    url: new URL(`https://example.com/source-url-of-evaluation-${Math.random()}`),
  }),
});

const toBadRequestResponse = (errors: Errors) => ({
  body: { error: PR.failure(errors).join('\n') },
  status: StatusCodes.BAD_REQUEST,
});

const toInternalServerErrorResponse = () => ({
  body: { error: 'Internal server error while generating Docmaps' },
  status: StatusCodes.INTERNAL_SERVER_ERROR,
});

export const docmapIndex: DocmapIndex = (ports) => flow(
  paramsCodec.decode,
  TE.fromEither,
  TE.mapLeft(toBadRequestResponse),
  TE.chainW(generateDocmapDois(ports)),
  TE.chainW(flow(
    TE.traverseArray(docmap(avoidRateLimitingWithDummyValues(ports))),
    TE.mapLeft(toInternalServerErrorResponse),
  )),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
