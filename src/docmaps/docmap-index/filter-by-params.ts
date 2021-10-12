import * as E from 'fp-ts/Either';
import { StatusCodes } from 'http-status-codes';
import { DocmapIndexEntryModel } from './docmap-index-entry-models';

type ErrorResponse = {
  body: { error: string },
  status: StatusCodes,
};

type FilterByParams = (
  query: string
) => (entries: ReadonlyArray<DocmapIndexEntryModel>) => E.Either<ErrorResponse, ReadonlyArray<DocmapIndexEntryModel>>;

// ts-unused-exports:disable-next-line
export const filterByParams: FilterByParams = () => (entries) => E.right(entries);
