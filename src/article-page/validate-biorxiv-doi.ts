import { NotFound } from 'http-errors';
import Doi from '../types/doi';

const biorxivPrefix = '10.1101';

export default (value: string): Doi => {
  let doi: Doi;
  try {
    doi = new Doi(value || '');
  } catch (error) {
    throw new NotFound(`${value} not found`);
  }
  if (!(doi.hasPrefix(biorxivPrefix))) {
    throw new NotFound('Not a bioRxiv DOI.');
  }
  return doi;
};
