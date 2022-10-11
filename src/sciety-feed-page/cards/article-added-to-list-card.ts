import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { ArticleAddedToListEvent } from '../../domain-events';
import { GetAllEvents } from '../../shared-ports';
import { getList } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

type Ports = {
  getAllEvents: GetAllEvents,
};

type ArticleAddedToListCard = (
  ports: Ports,
) => (event: ArticleAddedToListEvent) => TE.TaskEither<DE.DataError, ScietyFeedCard>;

export const articleAddedToListCard: ArticleAddedToListCard = (ports) => (event) => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(getList(event.listId)),
  TE.map(
    (list) => ({
      titleText: 'Somebody added an article to a list',
      linkUrl: `/lists/${event.listId}`,
      avatarUrl: '/static/images/sciety-logo.jpg',
      date: event.date,
      details: {
        title: toHtmlFragment(list.name),
        content: toHtmlFragment(list.description),
      },
    }),
  ),
);
