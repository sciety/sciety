import * as RA from 'fp-ts/ReadonlyArray';
import { GetSavedArticleDois } from './hardcoded-get-saved-articles';
import Doi from '../types/doi';

export const projectSavedArticleDois: GetSavedArticleDois = (userId) => {
  if (userId !== '1295307136415735808') {
    return [];
  }
  return RA.fromArray([
    new Doi('10.1101/2020.07.04.187583'),
    new Doi('10.1101/2020.09.09.289785'),
  ]);
};
