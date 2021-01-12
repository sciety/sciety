import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';
import { GetSavedArticleDois } from './hardcoded-get-saved-articles';
import Doi from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';

export const projectSavedArticleDois: GetSavedArticleDois = (userId) => {
  if (userId !== '1295307136415735808') {
    return [];
  }

  const events: ReadonlyArray<DomainEvent> = [
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

  return pipe(
    events,
    RA.filter(isUserSavedArticleEvent),
    RA.map((event) => event.articleId),
  );
};
