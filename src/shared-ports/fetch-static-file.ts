import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';

export type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;
