import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { Ports } from './docmap';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { ReviewId } from '../../types/review-id';
import { DocmapIndexEntryModel } from '../docmap-index/identify-all-possible-index-entries';

export type DocmapModel = {
  group: Group,
  inputPublishedDate: O.Option<Date>,
  evaluations: RNEA.ReadonlyNonEmptyArray<{
    sourceUrl: URL,
    reviewId: ReviewId,
    occurredAt: Date,
  }>,
};

type GenerateDocmapViewModel = (
  ports: Ports
) => (
  entry: DocmapIndexEntryModel
) => TE.TaskEither<DE.DataError, DocmapModel>;

// ts-unused-exports:disable-next-line
export const generateDocmapViewModel: GenerateDocmapViewModel = () => () => TE.left(DE.notFound);
