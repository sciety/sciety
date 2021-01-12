import * as RA from 'fp-ts/ReadonlyArray';
import { GetSavedArticleDois } from './hardcoded-get-saved-articles';
import Doi from '../types/doi';
import { UserSavedArticleEvent } from '../types/domain-events';

export const projectSavedArticleDois: GetSavedArticleDois = (userId) => {
  if (userId !== '1295307136415735808') {
    return [];
  }

  const events: ReadonlyArray<UserSavedArticleEvent> = [
    {
      type: 'UserSavedArticle',
      date: new Date(),
      userId,
      articleId: new Doi('10.1101/2020.07.04.187583'),
    },
    {
      type: 'UserSavedArticle',
      date: new Date(),
      userId,
      articleId: new Doi('10.1101/2020.09.09.289785'),
    },
  ];
  return RA.fromArray(events.map((event) => event.articleId));
};
