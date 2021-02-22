import * as O from 'fp-ts/Option';
import { flow } from 'fp-ts/function';
import * as Doi from '../types/doi';

const biorxivPrefix = '10.1101';

export const ensureBiorxivDoi = flow(
  Doi.fromString,
  O.filter((doi) => doi.hasPrefix(biorxivPrefix)),
);
