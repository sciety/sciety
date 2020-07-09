import { Maybe } from 'true-myth';
import Doi from '../types/doi';

const biorxivPrefix = '10.1101';

export default (value: string): Maybe<Doi> => {
  let doi: Doi;
  try {
    doi = new Doi(value);
  } catch (error) {
    return Maybe.nothing();
  }

  if (!(doi.hasPrefix(biorxivPrefix))) {
    return Maybe.nothing();
  }
  return Maybe.just(doi);
};
