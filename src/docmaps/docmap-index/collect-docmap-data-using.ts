import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { StatusCodes } from 'http-status-codes';
import { DocmapIndexEntryModel } from './identify-all-possible-index-entries';
import { Group } from '../../types/group';
import { ReviewId } from '../../types/review-id';
import { Ports } from '../docmap/docmap';

type DocmapModel = {
  group: Group,
  inputPublishedDate: O.Option<Date>,
  evaluations: RNEA.ReadonlyNonEmptyArray<{
    sourceUrl: URL,
    reviewId: ReviewId,
    occurredAt: Date,
  }>,
};

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
