import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error.js';

export type FetchStaticFile = (filename: string) => TE.TaskEither<DE.DataError, string>;
