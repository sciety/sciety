import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';
import { GetSavedArticleDois } from './hardcoded-get-saved-articles';
import Doi from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';
import toUserId from '../types/user-id';

type GetAllEvents = () => ReadonlyArray<DomainEvent>;

const getAllEvents: GetAllEvents = () => [
  {
    type: 'UserSavedArticle',
    date: new Date(),
    userId: toUserId('1295307136415735808'),
    articleId: new Doi('10.1101/2020.07.04.187583'),
  },
  {
    type: 'UserSavedArticle',
    date: new Date(),
    userId: toUserId('1295307136415735808'),
    articleId: new Doi('10.1101/2020.09.09.289785'),
  },
];

export const projectSavedArticleDois: GetSavedArticleDois = (userId) => pipe(
  getAllEvents(),
  RA.filter(isUserSavedArticleEvent),
  RA.filter((event) => event.userId === userId),
  RA.map((event) => event.articleId),
);
