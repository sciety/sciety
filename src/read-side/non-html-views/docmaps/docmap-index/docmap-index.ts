import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { decodeParams } from './filter-by-params';
import { renderDocmap } from '../docmap/render-docmap';

type DocmapIndexBody = {
  articles?: ReadonlyArray<unknown>,
  error?: string,
};

type DocmapIndex = (dependencies: Dependencies) => (query: Record<string, unknown>) => T.Task<{
  body: DocmapIndexBody,
  status: StatusCodes,
}>;

export const docmapIndex: DocmapIndex = (dependencies) => (query) => pipe(
  query,
  decodeParams,
  TE.fromEither,
  TE.chain(constructViewModel(dependencies)),
  TE.map(RA.map(renderDocmap)),
  TE.map((docmaps) => ({
    body: { articles: docmaps },
    status: StatusCodes.OK,
  })),
  TE.toUnion,
);
