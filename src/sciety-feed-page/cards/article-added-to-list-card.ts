import * as TE from 'fp-ts/TaskEither';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, {
  handle: string,
  avatarUrl: string,
}>;

type Ports = {
  getUserDetails: GetUserDetails,
};

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = () => (event) => TE.right(
  {
    titleText: 'Somebody added an article to a list',
    linkUrl: `/lists/${event.listId}`,
    avatarUrl: '/static/images/sciety-logo.jpg',
    date: event.date,
  },
);
