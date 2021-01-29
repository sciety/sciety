import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';

const biorxivPrefix = '10.1101';

export const ensureBiorxivDoi = (value: string): O.Option<Doi> => pipe(
  O.tryCatch(() => new Doi(value)),
  O.filter((doi) => doi.hasPrefix(biorxivPrefix)),
);
