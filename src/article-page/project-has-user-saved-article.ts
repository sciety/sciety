import * as T from 'fp-ts/Task';
import { HasUserSavedArticle } from './render-saved-link';

export const projectHasUserSavedArticle: HasUserSavedArticle = (doi, userId) => {
  const savedDois = ['10.1101/2020.07.04.187583', '10.1101/2020.09.09.289785'];
  return T.of(userId === '1295307136415735808' && savedDois.includes(doi.value));
};
