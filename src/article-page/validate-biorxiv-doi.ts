import { NotFound } from 'http-errors';
import createLogger from '../logger';
import Doi from '../types/doi';

const biorxivPrefix = '10.1101';

export default (value: string): Doi => {
  const log = createLogger('middleware:render-article-page');
  let doi: Doi;
  try {
    doi = new Doi(value || '');
  } catch (error) {
    log(`Invalid DOI '${value}': (${error})`);
    throw new NotFound(`${value} not found`);
  }
  if (!(doi.hasPrefix(biorxivPrefix))) {
    log(`DOI ${doi} is not from bioRxiv`);
    throw new NotFound('Not a bioRxiv DOI.');
  }
  return doi;
};
