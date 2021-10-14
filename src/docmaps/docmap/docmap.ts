import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Docmap } from './docmap-type';
import {
  DocmapIdentifier, generateDocmapViewModel, Ports,
} from './generate-docmap-view-model';
import { toDocmap } from './to-docmap';
import * as DE from '../../types/data-error';

type CreateDocmap = (
  ports: Ports,
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, Docmap>;

export const docmap: CreateDocmap = (ports) => ({ articleId, groupId }) => pipe(
  { articleId, groupId },
  generateDocmapViewModel(ports),
  TE.map(toDocmap),
);
