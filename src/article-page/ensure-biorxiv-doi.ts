import * as O from 'fp-ts/lib/Option';
import Doi from '../types/doi';

const biorxivPrefix = '10.1101';

export default (value: string): O.Option<Doi> => {
  let doi: Doi;
  try {
    doi = new Doi(value);
  } catch (error: unknown) {
    return O.none;
  }

  if (!(doi.hasPrefix(biorxivPrefix))) {
    return O.none;
  }
  return O.some(doi);
};
