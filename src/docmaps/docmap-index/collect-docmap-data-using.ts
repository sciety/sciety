import * as TE from 'fp-ts/TaskEither';
import { StatusCodes } from 'http-status-codes';
import { DocmapIndexEntryModel } from './identify-all-possible-index-entries';
import { Ports } from '../docmap/docmap';
import { DocmapModel } from '../docmap/generate-docmap-view-model';

type ErrorResponse = {
  body: { error: string },
  status: StatusCodes,
};

// ts-unused-exports:disable-next-line
export type CollectDocmapDataUsing = (
  ports: Ports
) => (
  entries: ReadonlyArray<DocmapIndexEntryModel>
) => TE.TaskEither<ErrorResponse, ReadonlyArray<DocmapModel>>;
