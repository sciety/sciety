import * as O from 'fp-ts/lib/Option';
import { GetSavedArticles } from './render-saved-articles';
import Doi from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';

export const getSavedArticles: GetSavedArticles = (userId) => {
  if (userId === '1295307136415735808') {
    return [
      {
        doi: new Doi('10.1101/2020.07.04.187583'),
        title: O.some(toHtmlFragment('Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action')),
      },
      {
        doi: new Doi('10.1101/2020.09.09.289785'),
        title: O.some(toHtmlFragment('The Costs and Benefits of a Modified Biomedical Science Workforce')),
      },
    ];
  }
  return [];
};
